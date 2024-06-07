import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
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
        });
    }
    environment = environment;
    readonly API_URL = `${environment.apiUrl}/agents`;
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
        this.getDataService.rues$.subscribe(rues => {
            this.rues = rues.map(rue => ({
                value: rue._id,
                label: rue.nomComplet,
            }));
        });
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
                // console.log(this.agents);
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
        let url = `${this.API_URL}`;
        console.log(this.dataForm.value);
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
        if (!agent) {
            console.error('Données invalides', agent);
            return;
        }
        console.log('agent update', agent);
        const updatedAgent = {
            ...agent,
            matricule: { ...agent.matricule },
            email: { ...agent.email },
            password: { ...agent.password },
            userAccess: { ...agent.userAccess },
            firstname: { ...agent.firstname },
            lastname: { ...agent.lastname },
            birthday: { ...agent.birthday },
            tel: { ...agent.tel },
            iceContact: { ...agent.iceContact },
            picture: { ...agent.picture },
            formations: { ...agent.formations },
        };

        const url = `${this.API_URL}/${this.selectedAgent._id}`;

        this.http.patch<Agent>(url, this.dataForm.value).subscribe({
            // this.http.patch<any>(url, updatedAgent).subscribe({
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
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet agent ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteAgent(agent._id);
            },
        });
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
        //
    }
    confirmDeleteDeleted(): void {
        // Mettez ici le code pour supprimer définitivement les données supprimées
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
                });
                this.getAgents(); // Met à jour la liste
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
        // Mettez ici le code pour restaurer les données supprimées
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
                });
                this.getAgents(); // Met à jour la liste
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
    selectAgent(agent: Agent) {
        this.selectedAgent = { ...agent };
        console.log("Sélection de l'agent", this.selectedAgent);
        const birthday = agent?.birthday ? new Date(agent.birthday) : null; // Convertit la date en instance de date si elle existe
        this.dataForm.patchValue({
            email: agent?.email,
            password: agent?.password,
            userAccess: agent?.userAccess,
            matricule: agent?.matricule,
            firstname: agent?.firstname,
            lastname: agent?.lastname,
            birthday: birthday,
            tel: agent?.tel,
            iceContact: agent?.iceContact,
            picture: agent?.picture,
            formations: agent?.formations || [],
        });
        console.log('Data form value: ', this.dataForm.value);
    }

    cancel() {
        this.selectedAgent = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedAgent = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        console.log(this.selectedAgent);
    }
    clear(table: Table) {
        table.clear();
    }

    addFormation(): void {
        // this.dataForm.formations.push(this.dataForm.control(''));
    }

    removeFormation(index: number): void {
        // this.formations.removeAt(index);
    }

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
      }
    
}
