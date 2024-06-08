export interface Agent {
    _id: number;
    email: string | null;
    password: string | null;
    userAccess: number | null;
    matricule: number | null;
    firstname?: string | null;
    lastname?: string | null;
    birthday?: Date | null;
    tel?: string | null;
    iceContact?: string | null;
    picture?: string | null;
    formations?: string[];
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
    lastConnection?: string | null; // Ajoutée
    enable?: boolean | null; // Ajoutée
}

export interface User {
    _id: number;
    email: string | null;
    password: string | null;
    userAccess: number | null;
    matricule: number | null;
    firstname?: string | null;
    lastname?: string | null;
    birthday?: Date | null;
    tel?: string | null;
    iceContact?: string | null;
    picture?: string | null;
    formations?: string[];
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
    lastConnection?: string | null; // Ajoutée
    enable?: boolean | null; // Ajoutée
}


