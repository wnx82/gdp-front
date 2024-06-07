import { Component, OnInit, ViewChild } from '@angular/core';
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
import { SelectItemGroup } from 'primeng/api';
import { Agent } from '../../../interfaces/User.interface';
import { Constat } from '../../../interfaces/Constat.interface';
import { Rue } from '../../../interfaces/Rue.interface.';
import { GetDataService } from '../../../services/getData/get-data.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-constats',
    templateUrl: './constats.component.html',
    styleUrls: ['./constats.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class ConstatsComponent implements OnInit {
    private apiUrl: string | undefined;
    constats: Constat[] = [];
    filteredRues: any[] = [];
    selectedConstat: any = {};
    @ViewChild('table') table: Table | undefined;
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        agents: new FormControl('', [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        pv: new FormControl('', [Validators.required]),
        vehicule: new FormGroup({
            marque: new FormControl(''),
            modele: new FormControl(''),
            couleur: new FormControl(''),
            type: new FormControl(''),
            immatriculation: new FormControl(''),
        }),
        personne: new FormGroup({
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            birthday: new FormControl(new Date()),
            nationalNumber: new FormControl(''),
            tel: new FormControl(''),
            adresse: new FormGroup({
                rue: new FormControl(''),
                cp: new FormControl(''),
                localite: new FormControl(''),
            }),
        }),
        adresse: new FormGroup({
            rue: new FormControl('', [Validators.required]),
            numero: new FormControl(''),
        }),

        infractions: new FormArray([]),
        notes: new FormControl(''),
        annexes: new FormArray([]),
    });
    checked: boolean = false;
    groupedAgents: SelectItemGroup[] = [];
    selectedAgents: Agent[] = [];
    agentsBrut: any[] = [];
    agents: any[] = [];
    agentsNeed: any[] = [];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService,
        private router: Router
    ) {}
    storedValue: any;
    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/constats`;
    rues$ = this.getDataService.rues$;
    agents$ = this.getDataService.agents$;
    statuses: any[] = [];
    ngOnInit() {
        this.getConstats();

        this.rues$.subscribe(
            rues => {
                this.rues = rues;
                // console.log(this.rues);
            },
            error => {
                console.error(error);
            }
        );
        //Récupérations des agents
        this.agents$.subscribe(agents => {
            this.agents = agents.map(agent => ({
                value: agent._id,
                label: agent.matricule,
            }));
            // console.log(this.agents);
        });
        this.statuses = [
            { label: 'Avertissement', value: false },
            { label: 'PV', value: true },
        ];
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }
    getConstats() {
        let url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe({
            next: data => {
                this.constats = data.filter(constat => !constat.deletedAt);
                // console.log(this.constats);
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

    editConstat(constatId: number) {
        this.router.navigate(['constats', constatId]);
    }

    onConfirmDelete(constat: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet constat ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteConstat(constat._id);
            },
        });
    }

    deleteConstat(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.constats = this.constats.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Constat effacé',
                });
                this.getConstats();
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
                this.getConstats(); // Met à jour la liste
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
                this.getConstats(); // Met à jour la liste
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

    selectConstat(constat: any) {
        this.selectedConstat = { ...constat };
        const date = constat?.date ? new Date(constat.date) : null; // Convertit la date en instance de date si elle existe
        const birthday = constat?.personne?.birthday
            ? new Date(constat?.personne?.birthday)
            : null; // Convertit la date en instance de date si elle existe
        this.dataForm.patchValue({
            adresse: {
                rue: constat?.adresse?.nomComplet,
                numero: constat?.adresse?.numero,
            },

            vehicule: {
                marque: constat?.vehicule?.marque,
                modele: constat?.vehicule?.modele,
                couleur: constat?.vehicule?.couleur,
                type: constat?.vehicule?.type,
                immatriculation: constat?.vehicule?.immatriculation,
            },
            personne: {
                firstname: constat?.personne?.firstname,
                lastname: constat?.personne?.lastname,
                birthday: birthday,
                nationalNumber: constat?.personne?.nationalNumber,
                tel: constat?.personne?.tel,
                adresse: {
                    rue: constat?.personne?.adresse?.rue,
                    cp: constat?.personne?.adresse?.cp,
                    localite: constat?.personne?.adresse?.localite,
                },
            },

            agents: constat?.agents || [],
            date: date,
            infractions: constat?.infractions,
            notes: constat?.notes,
            annexes: constat?.annexes,
        });
    }

    cancel() {
        this.selectedConstat = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedConstat = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        // console.log(this.selectedConstat);
    }

    clear(table: Table) {
        table.clear();
    }
    // create() {
    //     this.router.navigate(['constats/create']);
    // }
    create() {
        this.router.navigate(['/constats/create']);
    }
}
