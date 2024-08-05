interface JugInfo {
    name: string;
    id: string;
}

export interface MemberInfo {
    id: number;
    name: string;
    jugs: JugInfo[];
    lastDrank: number;
    drankToday: number;
    dailyTarget: number;
    tags: TagInfo[];
}

export interface FilterObject {
    searchTerm: string;
    sort: "asc" | "desc";
}

export interface TagInfo {
    id: number;
    name: string;
}

export interface CommunityInfo {
    name: string;
    isOwner: boolean;
}
