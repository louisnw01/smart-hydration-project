import { UserMode, UserUnit } from "@/constants/user";

export interface RegistrationInfo {
    email: string;
    password: string;
    name: string;
    height: string;
    weight: string;
    unit: UserUnit;
    medication: string;
    mode: UserMode;
    dob?: string;
}

export interface UserInfo {
    name: string;
    juguser: number;
    has_community: boolean;
    target: number;
}
