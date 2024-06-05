export interface Rapport {
    id?: number;
    daily: number;
    date: Date | null;
    agents?: string | null[];
    horaire?: string | null;
    vehicule?: string | null;
    quartiers?: string | null[];
    quartierMissionsValidate?: string | null[];
    missions?: string | null[];
    notes?: (string | null)[];
    annexes?: (string | null)[];
    sent?: Date | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
}
