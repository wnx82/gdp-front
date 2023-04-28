export interface Agent {
  _id?: string;
  email: string;
  password: string;
  matricule: string;
  userAccess: number;
  firstname?: string | null;
  lastname?: string | null;
  birthday?: Date | null;
  tel?: string | null;
  adresse?: {
    numero: string | null;
    nom: string | null;
    denomination: string | null;
    quartier: string | null;
    cp: number | null;
    localite: string | null;
  }[];
  picture: string | null;
  formations: (string | number)[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
