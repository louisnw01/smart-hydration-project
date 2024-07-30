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

interface Jug {
  name: string;
  id: string;
}

export interface PatientInfo {
  name: string;
  jugs: Jug[];
  target_percentage: number | null;
}

