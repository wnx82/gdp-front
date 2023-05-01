export interface Habitation {
    _id: number;
    adresse?: {
        rue: Rue | null;
        numero?: string | null;
        nomComplet?: string | null;
    };
    demandeur?: {
        nom: string | null;
        tel?: string | null;
    };
    dates: {
        debut: Date | null;
        fin: Date | null;
    };
    mesures: (string | null | undefined)[];

    vehicule?: string | null;
    googlemap?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
}

export interface Rue {
    _id?: string | null;
    nom?: string | null;
    nomComplet?: string | null;
    denomination?: string | null;
    codePostal?: string | null;
    ville?: string | null;
}
