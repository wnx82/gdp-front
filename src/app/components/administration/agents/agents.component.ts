import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';

import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { Agent } from '../../../interfaces/User.interface';
import { GetDataService } from '../../../services/getData/get-data.service';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class AgentsComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService
    ) {
        this.dataForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
            userAccess: new FormControl(1, [
                Validators.required,
                Validators.pattern(/^\d+$/),
            ]),
            matricule: new FormControl('', [
                Validators.required,
                Validators.pattern(/^\d+$/),
            ]),
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            birthday: new FormControl(''),
            tel: new FormControl(''),
            iceContact: new FormControl(''),
            picture: new FormControl(''),
            formations: new FormArray([]),
            enable: new FormControl(true),
            // lastConnection: new FormControl(''),
        });
    }

    environment = environment;
    readonly API_URL = `${environment.apiUrl}/agents`;
    readonly API_URL_PWD = `${environment.apiUrl}`;
    dataForm: FormGroup<any>;
    agents: Agent[] = [];
    filteredRues: any[] = [];
    selectedAgent: any = {
        birthday: new Date(),
    };
    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;

    storedValue: any;
    rues: any[] = [];

    date!: Date;

    ngOnInit() {
        this.getAgents();

    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    getAgents() {
        let url = `${this.API_URL}`;
        this.http.get<Agent[]>(url).subscribe({
            next: data => {
                this.agents = data.filter(agent => !agent.deletedAt);
                console.log(this.agents)
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    addAgent(agent: any) {
        if (this.dataForm.invalid) {
            return;
        }
        let url = `${this.API_URL}`;
        this.http.post<Agent>(url, this.dataForm.value).subscribe({
            next: data => {
                this.agents.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agent ajouté',
                });
                this.dataForm.reset();
                this.getAgents();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    editAgent(id: number, agent: any) {
        if (this.dataForm.invalid) {
            return;
        }

        const updatedAgent = { ...agent };

        if (!agent.password) {
            delete updatedAgent.password;
        }

        const url = `${this.API_URL}/${id}`;

        this.http.patch<Agent>(url, updatedAgent).subscribe({
            next: data => {
                const index = this.agents.findIndex(a => a._id === data._id);
                this.agents[index] = data;
                this.selectedAgent = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getAgents();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    onConfirmDelete(agent: Agent) {
        this.selectedAgent = agent; // Met à jour l'agent sélectionné
        this.displayConfirmationDelete = true;
    }

    deleteAgent(id: number) {
        this.http.delete<Agent>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.agents = this.agents.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Agent effacé',
                });
                this.getAgents();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
    }

    confirmDeleteDeleted(): void {
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
                });
                this.getAgents();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });

        this.displayConfirmationDialog = false;
    }

    confirmRestoreDeleted(): void {
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
                });
                this.getAgents();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    selectAgent(agent: any) {
        this.selectedAgent = { ...agent };
        console.log("Sélection de l'agent", this.selectedAgent);
    
        const birthday = agent?.birthday ? new Date(agent.birthday) : null;
    
        this.formations.clear();
    
        if (agent.formations && agent.formations.length > 0) {
            agent.formations.forEach((formation: any) => {
                this.formations.push(this.fb.control(formation));
            });
        }
    
        this.dataForm.patchValue({
            email: agent?.email,
            password: '',
            userAccess: agent?.userAccess,
            matricule: agent?.matricule,
            firstname: agent?.firstname,
            lastname: agent?.lastname,
            birthday: birthday,
            tel: agent?.tel,
            iceContact: agent?.iceContact,
            picture: agent?.picture,
            enable: agent?.enable,
        });
    
        console.log('Data form value: ', this.dataForm.value);
    }
    

    cancel() {
        this.selectedAgent = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = true;
        this.selectedAgent = {};
        this.dataForm.reset();
        this.formations.clear();
        this.dataForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.dataForm.get('password')?.updateValueAndValidity();
    }

    toggleEdit() {
        this.isEditing = true;
        this.dataForm.get('password')?.clearValidators();
        this.dataForm.get('password')?.updateValueAndValidity();
    }

    clear(table: Table) {
        table.clear();
    }
    get formations(): FormArray {
        return this.dataForm.get('formations') as FormArray;
    }
    addFormation() {
        this.formations.push(new FormControl(''));
      }
    
    removeFormation(index: number) {
    this.formations.removeAt(index);
    }
    sendResetPasswordEmail(email: string) {
        if (email) {
            console.log('Tentative d\'envoi de l\'email de réinitialisation du mot de passe à :', email);
            this.http.post(`${this.API_URL_PWD}/forgot-password`, { email }).subscribe(
                () => {
                    console.log('Lien de réinitialisation envoyé avec succès à :', email);
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Lien de réinitialisation envoyé à l\'email de l\'agent.' });
                },
                error => {
                    console.error('Erreur lors de l\'envoi du lien de réinitialisation :', error);
                    if (error.status === 404) {
                        console.error('404 Non trouvé - Email non trouvé dans la base de données');
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email non trouvé.' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'envoi du lien de réinitialisation.' });
                    }
                }
            );
        } else {
            console.log('Aucun email fourni');
        }
    }
    

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}
