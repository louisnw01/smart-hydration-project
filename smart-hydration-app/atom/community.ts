import { MemberInfo } from "@/interfaces/community";
import { atom } from "jotai";

export const membersAtom = atom(new Map());
export const selectedMemberAtom = atom<MemberInfo | null>(null);

export const selectedCommunityMemberAtom = atom(0);
export const selectedSortMethodAtom = atom<string>("1");
