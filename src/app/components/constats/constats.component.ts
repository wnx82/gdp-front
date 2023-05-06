import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
import { LocalStorageService } from 'src/app/services/localstorage/local-storage.service';
import { SelectItemGroup } from 'primeng/api';
import { Agent } from 'src/app/interfaces/Agent.interface';
import { Constat } from 'src/app/interfaces/Constat.interface';
import { Rue } from 'src/app/interfaces/Rue.interface.';
import { GetDataService } from 'src/app/services/getData/get-data.service';
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
        date: new FormControl('', [Validators.required]),
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
            birthday: new FormControl(''),
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
        // geolocation: new FormGroup({
        //     latitude: new FormControl(''),
        //     longitude: new FormControl(''),
        //     horodatage: new FormControl(''),
        // }),

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
        private getDataService: GetDataService
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
    //   getSeverity(status) {
    //     switch (status) {
    //         case 'unqualified':
    //             return 'danger';

    //         case 'qualified':
    //             return 'success';

    //         case 'new':
    //             return 'info';

    //         case 'negotiation':
    //             return 'warning';

    //         case 'renewal':
    //             return null;
    //     }
    // }
    getConstats() {
        let url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe({
            next: data => {
                this.constats = data.filter(constat => !constat.deletedAt);
                console.log(this.constats);
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

    addConstat(constat: any) {
        console.log(this.dataForm.value);
        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
            next: data => {
                this.constats.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Constat ajouté',
                });
                this.dataForm.reset();
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

    editConstat(id: number, constat: any) {
        if (!constat) {
            console.error('Données invalides', constat);
            return;
        }

        const url = `${this.API_URL}/${this.selectedConstat._id}`;

        this.http.patch<Constat>(url, this.dataForm.value).subscribe({
            next: data => {
                const index = this.constats.findIndex(a => a._id === data._id);
                this.constats[index] = data;
                this.selectedConstat = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getConstats();
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
                    detail: error.error.message,
                });
            },
        });
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
                birthday: constat?.personne?.birthday,
                nationalNumber: constat?.personne?.nationalNumber,
                tel: constat?.personne?.tel,
                adresse: {
                    rue: constat?.personne?.adresse?.rue,
                    cp: constat?.personne?.adresse?.cp,
                    localite: constat?.personne?.adresse?.localite,
                },
            },

            agents: constat?.agents || [],
            date: constat?.date,
            infractions: constat?.infractions,
            notes: constat?.notes,
            annexes: constat?.annexes,
            // geolocation: {
            //     latitude: constat?.geolocation?.latitude,
            //     longitude: constat?.geolocation?.longitude,
            //     horodatage: constat?.geolocation?.couleur,
            // },
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

    clear(table: Table) {
        table.clear();
    }
}
