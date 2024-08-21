import { unitConverter, unitsAtom } from "@/atom/user";
import { MemberInfo } from "@/interfaces/community";
import { useAtomValue } from "jotai";

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

export function generateDateString(timestamp) {
    if (!timestamp) {
        return null;
    }

    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let relativeTime;
    if (diffSec < 60) {
        relativeTime = `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
        relativeTime = `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
        relativeTime =
            diffHour === 1 ? "Over 1 hour ago" : `Over ${diffHour} hours ago`;
    } else if (diffDay === 1) {
        relativeTime = "Yesterday";
    } else {
        relativeTime = `${diffDay} days ago`;
    }

    const day = date.getDate();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ordinalSuffix = getOrdinalSuffix(day);
    const formattedDate = `${day}${ordinalSuffix} ${month} ${hours}:${minutes}`;

    return `${formattedDate} \n${relativeTime}`;
}

export interface MemberData {
    name: string;
    lastDrank: string;
    amountDrank: string;
    targetProgress: string;
    target: number;
}

export function useFormattedMemberData(member: MemberInfo) {
    const func = useFormattedMemberDataFunction();
    return func(member);
}

export function useFormattedMemberDataFunction() {
    const unit = useAtomValue(unitsAtom);
    return (member: MemberInfo) => ({
        name: member.name,
        lastDrank: generateDateString(member.lastDrank * 1000) || "No data",
        juguser: member.id,
        amountDrank: member.drankToday
            ? Math.floor(unitConverter(member.drankToday, unit)).toString()
            : "0",
        targetProgress:
            ((member.drankToday / member.dailyTarget) * 100)
                .toFixed(0)
                .toString() + "%",
        target: member.dailyTarget,
    });
}
