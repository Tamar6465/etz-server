export interface Goal {
    id: number;
    title: string;
    description?: string;
    type: string; // לדוג' "personal", "career" וכו'
}