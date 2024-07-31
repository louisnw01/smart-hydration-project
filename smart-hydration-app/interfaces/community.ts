export interface MemberInfo {
    id: number;
    name: string;
    last_drank?: number;
    target_percentage?: number;
    description?: string;
    drank_today?: number;
}

export interface FilterObject {
  searchTerm: string,
  sort: "asc" | "desc"
}

export interface TagInfo {
  id: number,
  name: string,
}
