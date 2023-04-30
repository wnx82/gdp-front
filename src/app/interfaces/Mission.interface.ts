export interface Mission {
    _id: number;
    title: string;
    description: string;
    category: string;
    horaire: string;
    contact: string;
    priority: string;
    visibility: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
