
def validate_response(response):
    if response.status_code == 200:
        return

    if response.details:
        error = response.details.get('error', None)

        if error == 'DeviceNotRegistered':
            raise DeviceNotRegisteredError(response)
        elif error == 'MessageRateExceeded':
            raise MessageRateExceededError(response)
        else:
            print("Unhandled Notification error:" + str(error))


class PushTicketError(Exception):
    """Base class for all push ticket errors"""
    def __init__(self, push_response):
        if push_response.message:
            self.message = push_response.message
        else:
            self.message = 'Unknown push ticket error'
        super(PushTicketError, self).__init__(self.message)

        self.push_response = push_response


class DeviceNotRegisteredError(PushTicketError):
    """Raised when the push token is invalid

    To handle this error, you should stop sending messages to this token.
    """
    pass


class MessageRateExceededError(PushTicketError):
    """Raised when you are sending messages too frequently to a device

    You should implement exponential backoff and slowly retry sending messages.
    """
    pass

