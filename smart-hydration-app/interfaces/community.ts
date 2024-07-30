export interface MemberInfo {
  id: number;
  name: string;
  last_drank?: number;
  drank_today?: number;
}

export interface FilterObject {
  searchTerm: string,
  sort: "asc" | "desc"
}

export interface TagInfo {
  name: string,
}
