export interface Habitation {
    length: number;
    _id: number;

    adresse?: {
        rue: Rue;
        numero?: string;
    };
    demandeur?: {
        nom: string;
        tel?: string;
    };
    dates: {
        debut: Date;
        fin: Date;
    };
    mesures?: string[];
    vehicule?: string;
    googlemap?: string;
    createdAt: string; // Ajout de la propriété createdAt
    updatedAt: string; // Ajout de la propriété updatedAt
    deletedAt: string;
}

export interface Rue {
    _id?: string;
    nom?: string;
    nomComplet?: string;
    denomination?: string;
    codePostal?: string;
    ville?: string;
}
