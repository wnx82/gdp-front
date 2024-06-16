import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { Quartier } from '../../../interfaces/Quartier.interface';
import { GetDataService } from '../../../services/getData/get-data.service';
import { Mission } from '../../../interfaces/Mission.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

    readonly API_URL = `${environment.apiUrl}/quartiers`;
    quartiers: Quartier[] = [];
    selectedQuartier: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;

    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm: FormGroup = this.fb.group({
        title: ['', Validators.required],
        missions: [[], Validators.required],
    });

    missions: any[] = [];
    missions$: Observable<Mission[]> = this.getDataService.missions$;

    ngOnInit(): void {
        this.get();
        this.getMissions();
    }

    getMissions() {
        this.missions$.subscribe(
            missions => {
                this.missions = missions
                    .filter(mission => mission._id !== null)
                    .map(mission => ({
                        value: mission._id!,
                        label: mission.title,
                    }));
            },
            error => console.error(error)
        );
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

    findMissionById(missionId: number): Observable<string> {
        return this.missions$.pipe(
            map(missions => missions.find(m => m._id === missionId)),
            map(mission => (mission ? mission.title : '')!)
        );
    }

    get() {
        this.http.get<Quartier[]>(this.API_URL).subscribe({
            next: data => {
                this.quartiers = data.filter(quartier => !quartier.deletedAt);
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
        this.dataForm.value.missions = this.dataForm.value.missions.map(
            (mission: any) => {
                const missionData = this.missions.find(
                    m => m.value === mission.value
                );
                return missionData ? missionData : mission;
            }
        );
        this.http.post<Quartier>(this.API_URL, this.dataForm.value).subscribe({
            next: data => {
                this.quartiers.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Quartier ajouté',
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
        if (!quartier) {
            console.error('Données invalides', quartier);
            return;
        }

        const url = `${this.API_URL}/${id}`;
        this.dataForm.value.missions = this.dataForm.value.missions.map(
            (mission: any) => {
                const missionData = this.missions.find(
                    m => m.value === mission.value
                );
                return missionData ? missionData : mission;
            }
        );
        this.http.patch<Quartier>(url, this.dataForm.value).subscribe({
            next: data => {
                const index = this.quartiers.findIndex(r => r._id === data._id);
                this.quartiers[index] = data;
                this.selectedQuartier = {};
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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La modification a échouée',
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
                    detail: 'Quartier effacé',
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

        this.displayConfirmationDialog = false;
    }

    confirmRestoreDeleted(): void {
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
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

    selectQuartier(quartier: any) {
        this.selectedQuartier = { ...quartier };
        console.log('selected:', this.selectedQuartier);
        // const missionsValues = quartier?.missions.map((missionId: string) => {
        //   const mission = this.missions.find((m) => m.value === missionId);
        //   console.log('mission found:', mission);
        //   return mission ? mission : { value: missionId, label: missionId };
        // });
        // console.log('missionsValues:', missionsValues);
        const missionsValues = quartier?.missions || [];
        this.dataForm.patchValue({
            title: quartier?.title,
            missions: missionsValues,
        });
        console.log('form values after patch:', this.dataForm.value);
    }

    cancel() {
        this.selectedQuartier = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedQuartier = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    search() {
        this.get();
    }

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}
