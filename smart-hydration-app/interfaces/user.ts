import { UserMode } from "@/constants/user";

export interface RegistrationInfo {
    email: string;
    password: string;
    name: string;
    mode: UserMode;
    dob?: string;
}
