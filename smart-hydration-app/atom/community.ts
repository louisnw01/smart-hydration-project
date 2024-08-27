import { MemberInfo } from "@/interfaces/community";
import { generateDateString } from "@/util/community";
import { atom } from "jotai";

export const membersAtom = atom(new Map());
export const selectedMemberAtom = atom<MemberInfo | null>(null);

export const selectedCommunityMemberAtom = atom(0);
export const selectedSortMethodAtom = atom<string>("1");

export const formattedMemberDataAtom = atom((get) => {
    const member = get(selectedMemberAtom);

    if (!member) return null;

    const memberData = {
        name: member.name,
        lastDrank: generateDateString(member.lastDrank * 1000) || "No data",
        amountDrank: member.drankToday
            ? member.drankToday.toString() + "ml"
            : null,
        targetProgress:
            (Math.min(((member.drankToday / member.dailyTarget) * 100), 100))
                .toFixed(0)
                .toString() + "%",
        target: member.dailyTarget,
    };
    return memberData;
});
