export interface Habitation {
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
}

export interface Rue {
    _id?: string;
    nom?: string;
    nomComplet?: string;
    codePostal?: string;
    ville?: string;
}
