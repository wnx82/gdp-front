import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, Routes } from '@angular/router';
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
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';

@Component({
    selector: 'app-create-agent',
    templateUrl: './create-agent.component.html',
    styleUrls: ['./create-agent.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateAgentComponent {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private _localStorageService: LocalStorageService,
        private router: Router
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
                Validators.minLength(3),
                Validators.required,
                // Validators.pattern(/^\d+$/),
            ]),
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            birthday: new FormControl(''),
            tel: new FormControl(''),
            iceContact: new FormControl(''),
            adresse: new FormGroup({
                rue: new FormControl(''),
                numero: new FormControl(''),
            }),
            picture: new FormControl(''),
            formations: new FormArray([]),
        });
    }
    private apiUrl: string | undefined;
    // dataForm = new FormGroup({
    //     email: new FormControl('', [Validators.required, Validators.email]),
    //     password: new FormControl('', [
    //         Validators.required,
    //         Validators.minLength(8),
    //     ]),
    //     userAccess: new FormControl(1, [
    //         Validators.required,
    //         Validators.pattern(/^\d+$/),
    //     ]),
    //     matricule: new FormControl('', [
    //         Validators.required,
    //         Validators.pattern(/^\d+$/),
    //     ]),
    //     firstname: new FormControl(''),
    //     lastname: new FormControl(''),
    //     birthday: new FormControl(''),
    //     tel: new FormControl(''),
    //     iceContact: new FormControl(''),
    //     adresse: new FormGroup({
    //         rue: new FormControl(''),
    //         numero: new FormControl(''),
    //     }),
    //     picture: new FormControl(''),
    //     formations: new FormArray([]),
    // });
    dataForm!: FormGroup;
    submitted = false;

    agents: any[] = [];
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
    readonly API_URL = `${environment.apiUrl}/agents`;
    date!: Date;
    ngOnInit() {
        this.rues = this._localStorageService.getRues();
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
        this.http.get<any[]>(url).subscribe({
            next: data => {
                this.agents = data.filter(agent => !agent.deletedAt);
                console.log(this.agents);
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
    // convenience getter for easy access to form fields
    get f() {
        return this.dataForm.controls;
    }

    addAgent(agent: any) {
        let url = `${this.API_URL}`;
        // console.log(this.dataForm.value);
        this.submitted = true;
        if (this.dataForm.invalid) {
            return;
        }
        this.http.post<any>(url, this.dataForm.value).subscribe({
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
            adresse: { ...agent.adresse },
            picture: { ...agent.picture },
            formations: { ...agent.formations },
        };

        const url = `${this.API_URL}/${this.selectedAgent._id}`;

        this.http.patch<any>(url, this.dataForm.value).subscribe({
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

    onConfirmDelete(agent: any) {
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
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
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
    selectAgent(agent: any) {
        this.selectedAgent = { ...agent };
        console.log("Sélection de l'agent", this.selectedAgent);
        this.dataForm.patchValue({
            email: agent?.email,
            password: agent?.password,
            userAccess: agent?.userAccess,
            matricule: agent?.matricule,
            firstname: agent?.firstname,
            lastname: agent?.lastname,
            birthday: agent?.birthday,
            tel: agent?.tel,
            iceContact: agent?.iceContact,
            adresse: {
                rue: agent?.adresse?.rue,
                numero: agent?.adresse?.numero,
            },
            picture: agent?.picture,
            formations: agent?.formations || [],
        });
        console.log('Data form value: ', this.dataForm.value);
    }

    cancel() {
        this.selectedAgent = {};
        this.isAdding = false;
        this.isEditing = false;
        this.submitted = false;
        this.router.navigate(['/agents']);
    }

    clear(table: Table) {
        table.clear();
        this.submitted = false;
    }

    addFormation(): void {
        // this.dataForm.formations.push(this.dataForm.control(''));
    }

    removeFormation(index: number): void {
        // this.formations.removeAt(index);
    }
}
