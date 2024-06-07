import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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
import { SelectItemGroup } from 'primeng/api';

import { BehaviorSubject } from 'rxjs';
import 'add-to-calendar-button';

import { Agent } from '../../../interfaces/User.interface';
import { Rapport } from '../../../interfaces/Rapports.interface';

import { GetDataService } from '../../../services/getData/get-data.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-rapports',
    templateUrl: './rapports.component.html',
    styleUrls: ['./rapports.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class RapportsComponent implements OnInit {
    @ViewChild('table') table: Table | undefined;
    private apiUrl: string | undefined;
    donnees: Rapport[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    groupedAgents: SelectItemGroup[] = [];
    selectedAgents: Agent[] = [];
    agentsBrut: any[] = [];
    agents: any[] = [];
    agentsNeed: any[] = [];

    dataForm = new FormGroup({
        daily: new FormControl('', [Validators.required]),
        agents: new FormControl('', [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        horaire: new FormControl(''),
        vehicule: new FormControl(''),
        quartiers: new FormControl([]),
        quartierMissionsValidate: new FormControl([]),
        missions: new FormControl([]),
        notes: new FormControl(''),
        annexes: new FormControl([]),
    });

    myData: string | undefined;
    // myQuartiers: any[] = [];
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService,
        private router: Router
    ) {}
    storedValue: any;

    readonly API_URL = `${environment.apiUrl}/rapports`;

    agents$ = this.getDataService.agents$;
    missions$ = this.getDataService.missions$;
    quartiers$ = this.getDataService.quartiers$;

    ngOnInit(): void {
        this.get();
        this.http.get<Agent[]>(`${environment.apiUrl}/agents`).subscribe(
            data => {
                this.agents = data.map(agent => ({
                    value: agent._id,
                    label: agent.matricule,
                }));
                // localStorage.setItem('agents', JSON.stringify(this.agents));
                // console.log('Sauvegarde des agents dans le local storage');
            },
            error => {
                console.error(error);
            }
        );
        //     this.myData = data;
        //     console.log('my Data', this.myData);
        // });
        // this.getDataService.getQuartiers();
        // this.getDataService.getQuartiers().subscribe(data => {
        //     this.myQuartiers = data;
        // });
        // this.getDataService.getQuartiers().subscribe(quartiers => {
        //     this.myQuartiers = quartiers;
        // });
        // console.log('myQuartiers', this.quartiers$);
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
    findQuartierById(quartierId: number): Observable<string> {
        return this.quartiers$.pipe(
            map(quartiers => quartiers.find(a => a._id === quartierId)),
            map(quartier => (quartier ? quartier.title : '')!)
            // Convert matricule to string
        );
    }
    loading: boolean = false;
    sendMail(rapportsId: number) {
        this.loading = true;
        const url = `${this.API_URL}/${rapportsId}/send`;
        this.http.post<any>(url, {}).subscribe({
            next: data => {},
            error: error => {
                this.handleError(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
        setTimeout(() => {
            this.loading = false;
            this.get();
        }, 500);
    }
    editRapport(RapportId: number) {
        this.router.navigate(['rapports', RapportId, 'edit']);
    }
    get() {
        this.http.get<Rapport[]>(this.API_URL).subscribe({
            next: data => {
                this.donnees = data.filter(donnee => !donnee.deletedAt);
                console.log(this.donnees);
            },
            error: error => {
                console.log(error);
            },
        });
    }

    add(donnee: Rapport) {
        this.http
            .post<Rapport>(`${this.API_URL}`, this.dataForm.value)
            .subscribe({
                next: data => {
                    this.donnees.push(data);
                    this.isAdding = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Donnée ajoutée',
                    });
                    this.dataForm.reset();
                    this.get();
                },
                error: error => {
                    this.handleError(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error.message,
                    });
                },
            });
    }

    edit(id: number, donnee: Rapport) {
        if (!donnee) {
            console.error('Données invalides', donnee);
            return;
        }
        const url = `${this.API_URL}/${id}`;

        this.http.patch<Rapport>(url, this.dataForm.value).subscribe({
            next: data => {
                const index = this.donnees.findIndex(a => a.id === data.id);
                this.donnees[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.get();
            },
            error: error => {
                console.error('Erreur de requête PATCH', error);
                if (error.error && error.error.message) {
                    console.error(
                        "Message d'erreur du serveur :",
                        error.error.message
                    );
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La modification a échouée',
                });
            },
        });
    }

    deleteDonnee(id: number) {
        this.http.delete<Rapport>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.donnees = this.donnees.filter(a => a.id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Donnée effacée',
                });
                this.get();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
                console.log(error);
            },
        });
    }

    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
        //
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
                this.get(); // Met à jour la liste
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
            complete: () => {
                this.displayConfirmationDialog = false;
            },
        });
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
                this.get(); // Met à jour la liste
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
    selectData(donnee: any) {
        this.selectedData = { ...donnee };
        this.dataForm.patchValue({
            agents: donnee?.agents,
        });
    }
    cancel() {
        this.selectedData = {};
        this.isAdding = false;
        this.isEditing = false;
    }
    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedData = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        // console.log(this.selectedData);
    }

    extractHoraires(horaire: string) {
        const [debut, fin] = horaire.split('-');
        const heure_debut = debut.trim();
        const heure_fin = fin.trim();
        return { heure_debut, heure_fin };
    }
    showHoraires = false;
}
