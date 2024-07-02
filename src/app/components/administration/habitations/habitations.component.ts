import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';

import { Habitation } from '../../../interfaces/Habitation.interface';
import { Rue } from '../../../interfaces/Rue.interface';
import { GetDataService } from '../../../services/getData/get-data.service';
import { ActivatedRoute } from '@angular/router';
import { HabitationsService } from '../../../services/components/habitations/habitations.service';

@Component({
    selector: 'app-habitations',
    templateUrl: './habitations.component.html',
    styleUrls: ['./habitations.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class HabitationsComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private _localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private getDataService: GetDataService,
        private habitationsService: HabitationsService,
        private route: ActivatedRoute
    ) {
        this.dataForm = this.formBuilder.group({
            adresse: this.formBuilder.group({
                rue: [''],
                numero: [''],
            }),
            demandeur: this.formBuilder.group({
                nom: [''],
                tel: [''],
            }),
            dates: this.formBuilder.group({
                debut: [new Date()],
                fin: [new Date()],
            }),
            mesures: this.formBuilder.array([]),
            vehicule: [''],
            googlemap: [''],
        });
    }

    habitations: Habitation[] = [];
    rues: Rue[] = [];
    selectedData: any = {};
    selectedHabitation: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    dataForm: FormGroup;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;

    mesures: string[] = [];

    rues$ = this.getDataService.rues$;
    habitations$ = this.getDataService.habitations$;

    ngOnInit() {
        this.getHabitations();
        this.getRues();
    }

    getRues() {
        this.habitationsService.getRues().subscribe(
            rues => {
                this.rues = rues;
            },
            error => {
                console.error(error);
            }
        );
    }

    getHabitations() {
        const active = this.route.snapshot.params['active'] === 'active';
        this.habitationsService.getHabitations(active).subscribe({
            next: data => {
                this.habitations = data.filter(
                    habitation => !habitation.deletedAt
                );
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

    getSeverity(
        localite: string
    ):
        | 'success'
        | 'secondary'
        | 'info'
        | 'warning'
        | 'danger'
        | 'contrast'
        | undefined {
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
                return 'success'; // Vous pouvez également retourner 'secondary' ou 'contrast' selon vos besoins
        }
    }

    addHabitation(habitation: any) {
        this.habitationsService.addHabitation(this.dataForm.value).subscribe({
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

        this.habitationsService
            .editHabitation(id, this.dataForm.value)
            .subscribe({
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
            message: 'Voulez-vous vraiment supprimer cette habitations ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteHabitation(habitation._id);
            },
        });
    }

    deleteHabitation(id: number) {
        this.habitationsService.deleteHabitation(id).subscribe({
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
    }

    confirmDeleteDeleted(): void {
        this.habitationsService.purgeHabitations().subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
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

        this.displayConfirmationDialog = false;
    }

    confirmRestoreDeleted(): void {
        this.habitationsService.restoreHabitations().subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
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

    selectHabitation(habitation: any) {
        this.selectedHabitation = { ...habitation };
        console.log('sélection de lhabitation', this.selectedHabitation);

        console.log('Liste des rues disponibles:', this.rues);
        console.log("Rue de l'habitation:", habitation.adresse.nomComplet);

        const selectedRue = this.rues.find(
            rue => rue.nomComplet === habitation.adresse.nomComplet
        );
        const rueId = selectedRue ? selectedRue._id : null;
        if (!rueId) {
            console.error('Rue non trouvée:', habitation.adresse.nomComplet);
        }

        const debut = habitation?.dates?.debut
            ? new Date(habitation.dates.debut)
            : null;
        const fin = habitation?.dates?.fin
            ? new Date(habitation.dates.fin)
            : null;
        this.mesures = habitation?.mesures || [];

        this.dataForm.patchValue({
            adresse: {
                rue: rueId,
                numero: habitation.adresse.numero,
            },
            demandeur: {
                nom: habitation.demandeur.nom,
                tel: habitation.demandeur.tel,
            },
            dates: {
                debut: debut,
                fin: fin,
            },
            mesures: habitation.mesures || [],
            vehicule: habitation.vehicule,
            googlemap: habitation.googlemap,
        });

        console.log('Data form value:', this.dataForm.value);
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
    }

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}
