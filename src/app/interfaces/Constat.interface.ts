export interface Constat {
    matricule?: string | null;
    nomComplet: string | null;
    _id?: number;
    agents: (string | { value: string } | number)[];
    date: Date | null;
    vehicule?: {
        marque?: string | null;
        modele?: string | null;
        couleur?: string | null;
        type?: string | null;
        immatriculation?: string | null;
    } | null;
    personne?: {
        firstname?: string | null;
        lastname?: string | null;
        birthday?: Date | null;
        nationalNumber?: string | null;
        tel?: string | null;
        adresse?: {
            rue?: string | null;
            cp?: string | null;
            localite?: string | null;
        } | null;
    } | null;
    adresse?: {
        rue: string | null;
        nomComplet: string | null;
        numero?: string | null;
    } | null;
    geolocation?: {
        latitude?: string | null;
        longitude?: string | null;
        horodatage?: Date | null;
    } | null;
    infractions?: (string | null)[];
    pv?: boolean | null;
    notes?: string | null;
    annexes?: (string | null)[];
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
