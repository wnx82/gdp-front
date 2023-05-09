import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService, SelectItem } from 'primeng/api';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';

import { Habitation } from 'src/app/interfaces/Habitation.interface';
import { Validation } from 'src/app/interfaces/Validation.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GetDataService } from 'src/app/services/getData/get-data.service';
import { Rue } from 'src/app/interfaces/Rue.interface.';
import { Agent } from 'src/app/interfaces/Agent.interface';

@Component({
    selector: 'app-validations',
    templateUrl: './validations.component.html',
    styleUrls: ['./validations.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ValidationsComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private _localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private getDataService: GetDataService
    ) {}
    private apiUrl: string | undefined;
    readonly API_URL = `${environment.apiUrl}/validations`;
    validations: Validation[] = [];

    filteredRues: any[] = [];
    selectedValidation: any = {};

    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        agents: new FormControl(''),
        habitation: new FormControl('', [Validators.required]),
        note: new FormControl(''),
        date: new FormControl(''),
    });
    agents: any[] = [];
    habitations: any[] = [];
    rues: Rue[] = [];
    currentDate: any = Date;
    agents$ = this.getDataService.agents$;
    habitations$ = this.getDataService.habitations$;
    rues$ = this.getDataService.rues$;

    ngOnInit() {
        this.getValidations();
        this.habitations$.subscribe(
            habitations => {
                this.habitations = habitations.map(habitation => ({
                    value: habitation._id,
                    label:
                        habitation.adresse?.nomComplet +
                        ', ' +
                        habitation.adresse?.numero,
                    // numero: habitation.adresse?.numero,
                }));
                console.log(this.habitations);
            },
            error => {
                console.error(error);
            }
        );
        this.rues$.subscribe(
            rues => {
                this.rues = rues;
            },
            error => {
                console.error(error);
            }
        );
        this.agents$.subscribe(
            agents => {
                // this.agents = agents;
                this.agents = agents.map(agent => ({
                    value: agent._id,
                    label: agent.matricule,
                }));
                // console.log(this.agents);
            },
            error => {
                console.error(error);
            }
        );
    }

    getValidations() {
        let url = `${this.API_URL}`;
        this.http.get<Validation[]>(url).subscribe({
            next: data => {
                this.validations = data.filter(
                    validation => !validation.deletedAt
                );
                // console.log(this.validations); // log each validation
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

    clear(table: Table) {
        table.clear();
    }
    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    getSeverity(localite: string): string {
        switch (localite) {
            case 'Dottignies':
                return 'warning';
            case 'Luingne':
                return 'danger';
            case 'Herseaux':
                return 'info';
            case 'Mouscron':
                return 'success';
            default:
                return 'success';
        }
    }

    addValidation(validation: any) {
        let url = `${this.API_URL}`;
        // console.log(validation);
        console.log(this.dataForm.value);

        this.http.post<Validation>(url, this.dataForm.value).subscribe({
            // this.dataForm.value.post<any>(url, validation).subscribe({
            // this.http.post<any>(url, validation).subscribe({
            next: data => {
                this.validations.push(data);

                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Validation ajoutée',
                });
                this.dataForm.reset();
                this.getValidations();
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

    editValidation(id: number, validation: any) {
        if (!validation) {
            console.error('Données invalides', validation);
            return;
        }
        console.log('validation update', validation);

        const url = `${this.API_URL}/${id}`;

        this.http.patch<any>(url, this.dataForm.value).subscribe({
            // this.http.patch<any>(url, updatedValidation).subscribe({
            next: data => {
                const index = this.validations.findIndex(
                    a => a._id === data._id
                );
                this.validations[index] = data;
                this.selectedValidation = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getValidations();
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

    onConfirmDelete(validation: Validation) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet validation ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteValidation(validation._id);
            },
        });
    }

    deleteValidation(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.validations = this.validations.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Validation effacée',
                });
                this.getValidations();
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
                this.getValidations(); // Met à jour la liste
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
                this.getValidations(); // Met à jour la liste
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

    selectValidation(validation: any) {
        this.selectedValidation = { ...validation };
        console.log('sélection de la validation', this.selectedValidation);
        this.dataForm.patchValue({
            agents: validation?.agent,
            habitation: validation?.habitation,
            note: validation?.note,
            date: validation?.date,
        });
        console.log('Data form value: ', this.dataForm.value);
    }

    cancel() {
        this.selectedValidation = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedValidation = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        // console.log(this.selectedValidation);
    }

    fillWithCurrentDate() {
        this.currentDate = new Date();
        this.dataForm.patchValue({
            date: this.currentDate,
        });
    }
}
