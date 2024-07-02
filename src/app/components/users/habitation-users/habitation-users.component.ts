import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Habitation } from '../../../interfaces/Habitation.interface';
import { Rue } from '../../../interfaces/Rue.interface';
import { HabitationsService } from '../../../services/components/habitations/habitations.service';
import { Table } from 'primeng/table';

import { GoogleMapsModule } from '@angular/google-maps';
@Component({
    selector: 'app-habitation-users',
    templateUrl: './habitation-users.component.html',
    styleUrl: './habitation-users.component.scss',
})
export class HabitationUsersComponent {
    habitationsUsers: Habitation[] = [];
    rues: Rue[] = [];
    dataForm: FormGroup;
    selectedHabitation: any = {};
    mesures: string[] = [];

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private habitationsService: HabitationsService
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
    clear(table: Table) {
        table.clear();
    }
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
                console.error('Erreur de chargement des rues:', error);
            }
        );
    }

    getHabitations() {
        this.habitationsService.getHabitations().subscribe({
            next: data => {
                this.habitationsUsers = data.filter(
                    habitation => !habitation.deletedAt
                );
                console.log('Habitations chargées:', this.habitationsUsers);
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
                console.error('Erreur de chargement des habitations:', error);
            },
        });
    }

    filterHabitations(searchTerm: string) {
        // Implémentez la logique de filtrage ici si nécessaire
    }

    clearFilters() {
        // Implémentez la logique pour vider les filtres ici si nécessaire
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
                return 'success';
        }
    }

    selectHabitation(habitation: any) {
        this.selectedHabitation = { ...habitation };
        console.log("Sélection de l'habitation:", this.selectedHabitation);

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
}
