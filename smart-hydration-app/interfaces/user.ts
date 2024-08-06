import { UserMode } from "@/constants/user";

export interface RegistrationInfo {
    email: string;
    password: string;
    name: string;
    mode: UserMode;
    dob?: string;
}

export interface UserInfo {
    name: string;
    juguser: number;
    has_community: boolean;
    target: number;
}
