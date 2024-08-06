import { MemberInfo } from "@/interfaces/community";
import { atom } from "jotai";
import { generateDateString } from "@/util/community";

export const membersAtom = atom(new Map());
export const selectedJugsForMemberAtom = atom<Set<string>>(new Set<string>());
export const selectedMemberAtom = atom<Partial<MemberInfo>>({});

export const selectedCommunityMemberAtom = atom(0);
export const selectedSortMethodAtom = atom<string>("1");

export const formattedMemberDataAtom = atom((get) => {
    const member = get(selectedMemberAtom);

    if (!member) return null;

    const memberData = {
        name: member.name,
        lastDrank: generateDateString(member.last_drank * 1000) || "No data",
        amountDrank: member.drank_today
            ? member.drank_today.toString() + "ml"
            : null,
        targetProgress:
            ((member.drank_today / member.target) * 100).toFixed(0).toString() +
            "%",
        target: member.target,
    };
    return memberData;
});
