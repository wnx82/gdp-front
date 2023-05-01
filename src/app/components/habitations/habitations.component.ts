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

@Component({
    selector: 'app-habitations',
    templateUrl: './habitations.component.html',
    styleUrls: ['./habitations.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class HabitationsComponent implements OnInit {
    private apiUrl: string | undefined;
    // habitations: Habitation[] = [];
    habitations: Habitation[] = [];
    filteredRues: any[] = [];
    selectedData: any = {};
    selectedHabitation: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        adresse: new FormGroup({
            rue: new FormControl(''),
            numero: new FormControl(''),
        }),
        demandeur: new FormGroup({
            nom: new FormControl(''),
            tel: new FormControl(''),
        }),
        dates: new FormGroup({
            debut: new FormControl(new Date()),
            fin: new FormControl(new Date()),
        }),
        mesures: new FormArray([]),
        // mesures: new FormArray([]),
        vehicule: new FormControl(''),
        googlemap: new FormControl(''),
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
        private fb: FormBuilder
    ) {}
    storedValue: any;
    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/habitations`;
    date!: Date;
    dates!: Date;
    selectedQuartier: any;
    selectedLocalite: any;
    ngOnInit() {
        this.getHabitations();
        this.rues = this._localStorageService.getRues();
    }

    getHabitations() {
        let url = `${this.API_URL}`;
        this.http.get<Habitation[]>(url).subscribe({
            next: data => {
                this.habitations = data.filter(
                    habitation => !habitation.deletedAt
                );
                console.log(this.habitations); // log each habitation
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

    addHabitation(habitation: any) {
        let url = `${this.API_URL}`;
        // console.log(habitation);
        console.log(this.dataForm.value);

        this.http.post<Habitation>(url, this.dataForm.value).subscribe({
            // this.dataForm.value.post<any>(url, habitation).subscribe({
            // this.http.post<any>(url, habitation).subscribe({
            next: data => {
                this.habitations.push(data);

                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Habitation ajoutée',
                });
                this.dataForm.reset();
                this.getHabitations();
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

    editHabitation(id: number, habitation: any) {
        if (!habitation) {
            console.error('Données invalides', habitation);
            return;
        }
        console.log('habitation update', habitation);
        const updatedHabitation = {
            // Écraser les champs modifiés
            ...habitation,
            adresse: {
                ...habitation.adresse,
            },
            demandeur: {
                ...habitation.demandeur,
            },
            dates: {
                ...habitation.dates,
            },
            mesures: habitation.mesures?.length
                ? habitation.mesures
                : habitation.mesures || [],
        };

        const url = `${this.API_URL}/${id}`;

        this.http.patch<Habitation>(url, this.dataForm.value).subscribe({
            // this.http.patch<any>(url, updatedHabitation).subscribe({
            next: data => {
                const index = this.habitations.findIndex(
                    a => a._id === data._id
                );
                this.habitations[index] = data;
                this.selectedHabitation = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getHabitations();
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

    onConfirmDelete(habitation: Habitation) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet habitation ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteHabitation(habitation._id);
            },
        });
    }

    deleteHabitation(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.habitations = this.habitations.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Habitation effacé',
                });
                this.getHabitations();
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
                this.getHabitations(); // Met à jour la liste
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
                this.getHabitations(); // Met à jour la liste
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

    // selectData(donnee: any) {
    //     console.log('on est là');
    //     this.selectedData = { ...donnee };
    //     this.dataForm.setValue({
    //         adresse: {
    //             rue: donnee.adresse.rue,
    //             numero: donnee.adresse.numero,
    //         },
    //         demandeur: {
    //             nom: donnee.demandeur.nom,
    //             tel: donnee.demandeur.tel,
    //         },
    //         dates: {
    //             debut: donnee.dates.debut,
    //             fin: donnee.dates.fin,
    //         },
    //         mesures: donnee.mesures || [],
    //         vehicule: donnee.vehicule,
    //         googlemap: donnee.googlemap,
    //     });
    //     console.log('Data form value: ', this.dataForm.value);
    // }

    selectHabitation(habitation: any) {
        this.selectedHabitation = { ...habitation };
        console.log('sélection de lhabitation', this.selectedHabitation);
        this.dataForm.patchValue({
            adresse: {
                rue: habitation?.adresse?.nomComplet,
                numero: habitation?.adresse?.numero,
            },
            demandeur: {
                nom: habitation?.demandeur?.nom,
                tel: habitation?.demandeur?.tel,
            },
            dates: {
                debut: habitation?.dates?.debut,
                fin: habitation?.dates?.fin,
            },

            mesures: habitation?.mesures || [],
            vehicule: habitation?.vehicule,
            googlemap: habitation?.googlemap,
        });
        console.log('Data form value: ', this.dataForm.value);
    }

    cancel() {
        this.selectedHabitation = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedHabitation = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        // console.log(this.selectedHabitation);
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
    //     const mesuresArray = this.selectedHabitation?.mesures || []; // Récupérer la liste de mesures
    //     const mesuresFormArray = this.dataForm.get('mesures') as FormArray; // Obtenir la référence au FormArray

    //     // Ajouter chaque élément de mesures au FormArray
    //     for (const mesure of mesuresArray) {
    //         mesuresFormArray.push(new FormControl(mesure));
    //     }
    // }
}
