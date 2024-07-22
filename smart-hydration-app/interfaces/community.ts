export interface MemberInfo {
    name: string;
    last_drank: number;
    target_percentage: number,
    description: string;
}

export interface FilterObject {
    searchTerm: string,
    sort: "asc" | "desc"
  }