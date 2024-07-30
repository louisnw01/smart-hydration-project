export interface MemberInfo {
    id: number;
    name: string;
    last_drank?: number;
    target_percentage?: number;
    description?: string;
}

export interface FilterObject {
    searchTerm: string;
    sort: "asc" | "desc";
}
