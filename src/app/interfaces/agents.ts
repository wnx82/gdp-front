export interface Agent {
    _id: number;
    email: string;
    password: string;
    userAccess: number;
    matricule: number;
    firstname?: string;
    lastname?: string;
    birthday?: Date;
    tel?: string;
    iceContact?: string;
    adresse?: {
        rue?: string;
        numero?: string;
    };
    picture?: string;
    formations?: string[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
