from typing import List, Optional
from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str


class TargetUpdate(BaseModel):
    newValue: int


class AddJugsToMemberForm(BaseModel):
    jugIds: List[str]
    communityMember: int


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    dob: Optional[str] = None

    # class Config:
    #     arbitrary_types_allowed = False


class JugLink(BaseModel):
    jugId: str


class LinkJugsForm(BaseModel):
    jugIds: List[str]


class JugUserUpdate(BaseModel):
    id: int
    key: str
    value: str


class UpdateJugForm(BaseModel):
    jugId: str
    name: str


class AddDrinkForm(BaseModel):
    timestamp: int
    name: str
    capacity: int


class CreateCommunityForm(BaseModel):
    name: str


class AddJugUserForm(BaseModel):
    name: str
    dob: Optional[str] = None


class CreateInvitationForm(BaseModel):
    permission: str


class VerifyEmailForm(BaseModel):
    code: str


class DeleteCommunityMemberForm(BaseModel):
    id: int


class PushTokenForm(BaseModel):
    pushToken: str


class ToggleNotificationsForm(BaseModel):
    notificationSelection: str
    pushToken: str


class CreateTagForm(BaseModel):
    tagName: str


class UpdateTagForm(BaseModel):
    currentName: str
    newName: str


class DeleteTagForm(BaseModel):
    tagName: str
