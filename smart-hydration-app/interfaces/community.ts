interface JugInfo {
    name: string;
    id: string;
    waterLevel: number;
}

export interface MemberInfo {
    id: number;
    name: string;
    jugs: JugInfo[];
    lastDrank: number;
    drankToday: number;
    dailyTarget: number;
    tags: TagInfo[];
    room: string;
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
// above, 'name' represents community name, below 'name' represents user name
export interface CommunityUser extends CommunityInfo {
    id: number;
}
