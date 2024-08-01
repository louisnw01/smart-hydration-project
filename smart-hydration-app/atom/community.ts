import { MemberInfo } from "@/interfaces/community";
import { atom } from "jotai";

export const membersAtom = atom(new Map());
export const selectedJugsForMemberAtom = atom<Set<string>>(new Set<string>());
export const selectedMemberAtom = atom<Partial<MemberInfo>>({});
