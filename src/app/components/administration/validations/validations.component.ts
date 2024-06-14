import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { Validation } from '../../../interfaces/Validation.interface';
import { GetDataService } from '../../../services/getData/get-data.service';
import { Rue } from '../../../interfaces/Rue.interface.';

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

    readonly API_URL = `${environment.apiUrl}/validations`;
    validations: Validation[] = [];
    filteredRues: any[] = [];
    selectedValidation: any = {};

    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    
    dataForm: FormGroup = this.fb.group({
        agents: [''],
        habitation: ['', [Validators.required]],
        note: [''],
        date: [new Date()],
    });

    agents: any[] = [];
    habitations: any[] = [];
    // habitations: {label: string, value: string}[] = [];
    rues: Rue[] = [];
    currentDate: any = Date;

    agents$ = this.getDataService.agents$;
    habitationsActive$ = this.getDataService.habitationsActive$;
    rues$ = this.getDataService.rues$;

    ngOnInit() {
        this.getValidations();
        this.getHabitations();
        this.getAgents();
    }

    getAgents() {
        this.getDataService.agents$.subscribe(
            agents => {
                this.agents = agents
                    .filter(agent => agent.matricule !== null)
                    .map(agent => ({
                        value: agent.matricule!,
                        label: `Agent ${agent.matricule}`,
                    }));
            },
            error => console.error(error)
        );
    }
    getHabitations(){
        this.habitationsActive$.subscribe(
            habitations => {
                this.habitations = habitations.map(habitation => ({
                    value: habitation._id,
                    label: habitation.adresse?.nomComplet + ', ' + habitation.adresse?.numero,
                }));
            },
            error => console.error(error)
        );
        this.rues$.subscribe(
            rues => this.rues = rues,
            error => console.error(error)
        );
    }
    getValidations() {
        this.http.get<Validation[]>(this.API_URL).subscribe({
            next: data => this.validations = data.filter(validation => !validation.deletedAt),
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
    }

    clear(table: Table) {
        table.clear();
    }

    getSeverity(localite: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
        switch (localite) {
            case 'Dottignies': return 'warning';
            case 'Luingne': return 'danger';
            case 'Herseaux': return 'info';
            case 'Mouscron': return 'success';
            default: return 'success';
        }
    }

    addValidation(validation: any) {
        this.http.post<Validation>(this.API_URL, this.dataForm.value).subscribe({
            next: data => {
                this.validations.push(data);
                this.isAdding = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Validation ajoutée' });
                this.dataForm.reset();
                this.getValidations();
            },
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
    }

    editValidation(id: number, validation: any) {
        if (!validation) {
            console.error('Données invalides', validation);
            return;
        }
        this.http.patch<any>(`${this.API_URL}/${id}`, this.dataForm.value).subscribe({
            next: data => {
                const index = this.validations.findIndex(a => a._id === data._id);
                this.validations[index] = data;
                this.selectedValidation = {};
                this.isEditing = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
                this.dataForm.reset();
                this.getValidations();
            },
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
    }

    onConfirmDelete(validation: Validation) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet validation ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteValidation(validation._id),
        });
    }

    deleteValidation(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.validations = this.validations.filter(a => a._id !== id);
                this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Validation effacée' });
                this.getValidations();
            },
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
    }

    deleteDeleted() {
        this.displayConfirmationDialog = true;
    }

    confirmDeleteDeleted() {
        this.http.post(`${this.API_URL}/purge`, {}).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complètement effacées' });
                this.getValidations();
            },
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
        this.displayConfirmationDialog = false;
    }

    confirmRestoreDeleted() {
        this.http.post(`${this.API_URL}/restore`, {}).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été restaurées avec succès' });
                this.getValidations();
            },
            error: error => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message }),
        });
    }

    selectValidation(validation: any) {
        this.selectedValidation = { ...validation };
        console.log('selectedValidation',this.selectValidation)
        const date = validation?.date ? new Date(validation.date) : null;
        const agentValues = validation?.agents?.matricule || [];
        this.dataForm.patchValue({
            agents: agentValues,
            habitation: validation?.habitation?._id,
            note: validation?.note,
            date: date,
        });
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
    }

    fillWithCurrentDate() {
        this.currentDate = new Date();
        this.dataForm.patchValue({ date: this.currentDate });
    }

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}
