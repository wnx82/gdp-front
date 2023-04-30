import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import {
    FormControl,
    FormGroup,
    FormArray,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../services/localstorage/local-storage.service';
import { Quartier } from 'src/app/interfaces/Quartier.interface';
import { GetDataService } from 'src/app/services/getData/get-data.service';
import { Mission } from 'src/app/interfaces/Mission.interface';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-quartiers',
    templateUrl: './quartiers.component.html',
    styleUrls: ['./quartiers.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class QuartiersComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private _localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private getDataService: GetDataService
    ) {}
    private apiUrl: string | undefined;
    readonly API_URL = `${environment.apiUrl}/quartiers`;
    quartiers: Quartier[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;

    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        title: new FormControl(''),
        missions: new FormControl(''),
    });
    selectedMission: any;
    storedValue: any;
    missions: Mission[] = [];
    missions$: Observable<Mission[]> = this.getDataService.missions$;

    ngOnInit(): void {
        this.get();
        // console.log(this.missions$);
        // this._localStorageService.getMissions();
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
    // findMissionById(missionId: number): string {
    //     const mission: Mission | undefined = this.missions$.find(
    //         m => m._id === missionId
    //     );
    //     console.log(mission?.title);
    //     // console.log(mission.title);
    //     return mission ? mission.title : '';
    // }
    findMissionById(missionId: number): Observable<string> {
        return this.missions$.pipe(
            map(missions => missions.find(m => m._id === missionId)),
            map(mission => (mission ? mission.title : ''))
        );
    }

    get() {
        this.http.get<Quartier[]>(`${this.API_URL}`).subscribe({
            next: data => {
                // console.log(data);
                this.quartiers = data.filter(quartier => !quartier.deletedAt);
                // console.log(this.quartiers);
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
    add(quartier: any) {
        this.http
            .post<Quartier>(`${this.API_URL}`, this.dataForm.value)
            .subscribe({
                next: data => {
                    this.quartiers.push(data);
                    this.isAdding = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Rue ajoutée',
                    });
                    this.dataForm.reset();
                    this.get();
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
    edit(id: number, quartier: any) {
        console.log(quartier);
        if (!quartier) {
            console.error('Données invalides', quartier);
            return;
        }
        // Vérifier chaque champ de la quartier et utiliser la valeur actuelle si le champ n'a pas été modifié
        const updatedRue = {
            title:
                quartier.title !== null
                    ? quartier.title
                    : this.selectedData.title,
            missions:
                quartier.missions !== null
                    ? quartier.missions
                    : this.selectedData.missions,

            // Ajouter les autres champs de la quartier ici si nécessaire
        };
        const url = `${this.API_URL}/${id}`;
        this.http.patch<Quartier>(url, this.dataForm.value).subscribe({
            next: data => {
                const index = this.quartiers.findIndex(r => r._id === data._id);
                this.quartiers[index] = data;
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
                    // detail: error.error.message,
                });
            },
        });
    }
    onConfirmDelete(mission: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cette mission ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.delete(mission._id);
            },
        });
    }
    delete(id: number) {
        this.http.delete<Quartier>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.quartiers = this.quartiers.filter(r => r._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Rue effacée',
                });
                this.get();
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
            title: donnee?.title,
            missions: donnee?.mssions,
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
    search() {
        this.get();
    }
}
