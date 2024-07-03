from typing import List
from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class JugLink(BaseModel):
    jugId: str


class LinkJugsForm(BaseModel):
    jugIds: List[str]


class UpdateJugForm(BaseModel):
    jugId: str
    name: str
