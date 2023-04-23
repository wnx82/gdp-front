import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

export interface Agent {
    _id: string;
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
}

export interface Rue {
    nomComplet: string;
}

export interface AgentsComponent {
    agents: Agent[];
    filteredRues: string[];
    selectedAgent: Agent;
    isAdding: boolean;
    isEditing: boolean;
    displayConfirmationDelete: boolean;
    displayConfirmationDialog: boolean;
    dataForm: FormGroup;
    rues: Rue[];
    readonly apiUrl: string;
    date: Date;
    ngOnInit(): void;
    getAgents(): void;
    addAgent(agent: Agent): void;
    editAgent(id: string, agent: Agent): void;
    onConfirmDelete(agent: Agent): void;
    deleteAgent(id: string): void;
    deleteDeleted(): void;
    confirmDeleteDeleted(): void;
    confirmRestoreDeleted(): void;
    selectAgent(agent: Agent): void;
    cancel(): void;
    toggleAdd(): void;
    toggleEdit(): void;
    filterRues(event: any): void;
    addFormation(): void;
    removeFormation(index: number): void;
}
