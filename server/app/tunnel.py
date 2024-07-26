from enum import Enum
from typing import Dict
from starlette.websockets import WebSocketDisconnect
from typing_extensions import Literal
from pony.orm.core import db_session

from .auth import auth_user, decode_auth_token
from .services import get_user_by_id
from .models import User, Jug

# this class wraps websockets to simplify them
# we can create a 'tunnel' server, which allows the app to subscribe to specific events
# tunnel client is written in typescript


class MessageType(Enum):
    CONNECT = 1
    SUBSCRIBE = 2
    UNSUBSCRIBE = 3
    OK = 4
    ERROR = 5
    EVENT = 6


class TunnelServer:
    def __init__(self, auth_key_function):
        self.auth_key = auth_key_function   # this function should return true/false, and should check if the key provided is valid
        self.events = {}    # holds a dictionary of events in the format:
                            #   event_name: {
                            #       subscribers: set of key/variable pairs
                            #       deriver function: if this is given then it will be run instead of subscribing to an event
                            #       private: boolean of whether this event can be subscribed to by the client
                            #   }
        self.ws = {}

    # create an event that the user can subscribe to
    def create_event(self, name, deriver_function=None, private=False):
        self.events[name] = {
            "subscribers": set(),
            "deriver_function": deriver_function,
            "private": private,
        }

    def handle_client(self, data):
        """
        handles client messages (chooses whether it is a subscribe or unsubscribe message)
        """
        return {
            MessageType.SUBSCRIBE: self.handle_subscribe,
            MessageType.UNSUBSCRIBE: self.handle_unsubscribe,
            }[MessageType(data[0])](*data[1:])

    async def handle_connect(self, ws):
        try:
            await ws.accept()

            connection_data = await ws.receive_json()
            key = connection_data[1]

            if not self.auth_key(key):
                await ws.send_json(self.error('invalid key'))
                return await ws.close()
            self.ws[key] = ws
            await ws.send_json(self.ok('connected'))

            while 1:
                data = await ws.receive_json()
                response = self.handle_client(data)
                await ws.send_json(response)
        except WebSocketDisconnect:
            return

    def handle_subscribe(self, client_key, event_name, event_variable, from_client=True, derived_key=None):
        """
        Handles subscribe messages
        :param from_client: used to override a 'private' subscriber class
        :param derived_key: if this needs to fire to a derived event, place its key here
        """
        event = self.events.get(event_name)

        if event is None:
            return self.error('invalid event name')

        if from_client and event['private']:
            return self.error("couldn't subscribe")
        if event['deriver_function']:
            for jug_id in event['deriver_function'](client_key):
                self.handle_subscribe(client_key, 'jug-latest', jug_id, from_client=False, derived_key=event_name)

        event['subscribers'].add((client_key, event_variable, derived_key))
        return self.ok('subscribed')

    def handle_unsubscribe(self, client_key, name, variable):
        obj = None
        for obj in self.events[name]['subscribers']:
            if obj[0] == client_key and obj[1] == variable:
                break;
        self.events[name]['subscribers'].remove(obj)

        return self.ok('unsubscribed')

    async def fire(self, name, var, data):
        event = self.events.get(name)
        if not event:
            raise Exception('not a valid event')
        for obj in event['subscribers']:
            if obj[1] != var:
                continue
            # this line will replace the event name with the derived name if exists
            name = obj[2] if name else name
            await self.ws[obj[0]].send_json([MessageType.EVENT.value, name, data])

    def error(self, message):
        return (MessageType.ERROR.value, message)

    def ok(self, message):
        return (MessageType.OK.value, message)
