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

import { Habitation, Rue } from 'src/app/interfaces/Habitation.interface';
import { Validation } from 'src/app/interfaces/validation.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GetDataService } from 'src/app/services/getData/get-data.service';

@Component({
    selector: 'app-validations',
    templateUrl: './validations.component.html',
    styleUrls: ['./validations.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ValidationsComponent implements OnInit {
    private apiUrl: string | undefined;
    // validations: Habitation[] = [];
    validations: Validation[] = [];
    habitations: Habitation[] = [];
    filteredRues: any[] = [];
    selectedValidation: any = {};

    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        agent: new FormControl('', [Validators.required]),
        habitation: new FormControl('', [Validators.required]),
        note: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
    });
    // mesures = [
    //     "Système d'alarme : Oui",
    //     'Eclairage extérieur : Oui',
    //     "Minuterie d'éclairage : Oui",
    //     'Société gardiennage : Non',
    //     'Chien : Non',
    //     "Présence d'un tiers : Non",
    //     'Autres : volets roulants programmables, éclairage programmé entrée et chambres',
    // ];
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private _localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private getDataService: GetDataService
    ) {}
    storedValue: any;
    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/validations`;

    agents$ = this.getDataService.agents$;
    habitation$ = this.getDataService.habitations$;
    date!: Date;
    dates!: Date;
    selectedQuartier: any;
    selectedLocalite: any;
    ngOnInit() {
        this.getValidations();
        // this.rues = this._localStorageService.getRues();
    }

    getValidations() {
        let url = `${this.API_URL}`;
        this.http.get<Validation[]>(url).subscribe({
            next: data => {
                this.validations = data.filter(
                    validation => !validation.deletedAt
                );
                console.log(this.validations); // log each validation
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
    findAgentById(agentId: number): Observable<string> {
        return this.agents$.pipe(
            map(agents => agents.find(a => a._id === agentId)),
            map(agent => (agent?.matricule ? agent.matricule.toString() : '')) // Convert matricule to string
        );
    }
    findHabitationById(agentId: number): Observable<string> {
        return this.agents$.pipe(
            map(agents => agents.find(a => a._id === agentId)),
            map(agent => (agent?.matricule ? agent.matricule.toString() : '')) // Convert matricule to string
        );
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

        this.http.patch<Validation>(url, this.dataForm.value).subscribe({
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
                    detail: 'Validation effacé',
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
        // console.log('sélection de la validation', this.selectedValidation);
        this.dataForm.patchValue({
            agent: validation?.agent,
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

    filterRues(event: any) {
        const query = event.query.toLowerCase();
        this.filteredRues = this.rues
            .filter(
                rue =>
                    typeof rue.nomComplet === 'string' &&
                    rue.nomComplet.toLowerCase().includes(query)
            )

            .sort((a, b) => {
                const aIndex = a.nomComplet.toLowerCase().indexOf(query);
                const bIndex = b.nomComplet.toLowerCase().indexOf(query);
                if (aIndex < bIndex) {
                    return -1;
                }
                if (aIndex > bIndex) {
                    return 1;
                }
                // Si les deux rues ont la même position de la requête,
                // on les trie par ordre alphabétique
                return a.nomComplet.localeCompare(b.nomComplet);
            })

            .slice(0, 10)
            .map(rue => rue.nomComplet);
    }

    // addMesures() {
    //     const mesuresArray = this.selectedValidation?.mesures || []; // Récupérer la liste de mesures
    //     const mesuresFormArray = this.dataForm.get('mesures') as FormArray; // Obtenir la référence au FormArray

    //     // Ajouter chaque élément de mesures au FormArray
    //     for (const mesure of mesuresArray) {
    //         mesuresFormArray.push(new FormControl(mesure));
    //     }
    // }
}
