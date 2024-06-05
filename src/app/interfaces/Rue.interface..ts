export interface Rue {
    _id: number;
    nom: string | null;
    denomination: string | null;
    nomComplet: string | null;
    quartier: string | null;
    cp: number | null;
    localite: string | null;
    codeRue: string | null;
    traductionNl: string | null;
    xMin: string | null;
    xMax: string | null;
    yMin: string | null;
    yMax: string | null;
    idTronconCentral: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
