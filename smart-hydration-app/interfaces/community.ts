export interface MemberInfo {
    name: string;
    last_drank?: number;
    target_percentage?: number,
    description?: string;
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