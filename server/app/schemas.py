from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class JugUserUpdate(BaseModel):
    id: int
    key: str
    value: str


