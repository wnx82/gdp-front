export interface Mission {
    id(id: any): unknown;
    includes(_id: number): unknown;
    _id: number;
    title: string | null;
    description: string | null;
    category: string | null;
    horaire: string | null;
    contact: string | null;
    priority: string | null;
    visibility: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
