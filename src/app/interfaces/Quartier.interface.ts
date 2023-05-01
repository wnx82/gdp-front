import { Mission } from './Mission.interface';

export interface Quartier {
    _id: number;
    title: string | null;
    missions: Mission[];
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
