class Column:
    def __init__(self, type):
        self.cond = None


    def __eq__(self, value: object, /) -> bool:
        self.cond = self.name+" == "+value



class Entity:
    def __init__(self):
        columns = [col for col in dir(self) if not col.startswith('__') and col != 'where']

        self.name = self.__class__.__qualname__

        for col in columns:
            getattr(self, col).name = col





class Query:
    def __init__(self, start, entity):
        self.entity = entity
        self.query = f'SELECT * from {entity.__name__}'

        columns = [col for col in dir(self) if not col.startswith('__') and col != 'where']

        # for col in columns:
            # setattr(Entity, col, Column())

        # print(getattr(self, columns[0]))

    def where(self, conditional):
        print('ran', conditional)
        self.query += f" WHERE {self.entity.id.cond}"
        print(self.query)

    def __eq__(self, value: object, /) -> bool:
        pass


class User(Entity):
    id = Column(str)


class Points(Entity):
    number = Column(int)




def bind(*args):
    for cls in args:
        cls()




def find(entity):
    return Query('SELECT', entity)



entities = (User, Points)


bind(*entities)

find(User).where(User.id == '123')

find(Points).where(Points.number == 'hello')



# user = await tm.find(User).where(User.id == '123').sort('asc')




server = Tunnel()
server.create_event('telemetry', num_vars=1)


# inside restful call to get data
# server.fire('telemetry', 'jug001052', data=telemetry_data)

# inside wss async
server.handle_client(ws)



def on_bar(obj):
    for row in obj:
        pass


def handle_connect():
    tunnel.subscribe('bars.AAPL', on_bar)


tunnel = Tunnel('https://tunnel.louisnw.com', key="mySecretKey")

tunnel.connect(handle_connect)
