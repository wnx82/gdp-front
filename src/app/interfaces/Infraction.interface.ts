export interface Infraction {
    _id?: number;
    category?: string | null;
    priority?: number | null;
    list: any | null[];
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
}
