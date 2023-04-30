import { Mission } from './Mission.interface';

export interface Quartier {
    _id: number;

    title: string;
    missions: Mission[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
