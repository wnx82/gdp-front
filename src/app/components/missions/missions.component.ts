import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-missions',
    templateUrl: './missions.component.html',
    styleUrls: ['./missions.component.css'],
    providers: [MessageService]
})
export class MissionsComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    missions: any[] = [];
    selectedData: any = {};
    isAdding = false;
    isEditing = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        category: new FormControl(''),
        horaire: new FormControl(''),
        contact: new FormControl(''),
        visibility: new FormControl(true, [Validators.pattern('true|false')]),
        priority: new FormControl(''),
        // annexes: new FormControl(''),
    });
    constructor(private http: HttpClient,
        private messageService: MessageService,) { }
    readonly API_URL = `${environment.apiUrl}/missions`;
    ngOnInit(): void {
        this.get();
    }
    private handleError(error: any): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }
    get() {
        this.http.get<any[]>(`${this.API_URL}`).subscribe(
            data => {
                this.missions = data.filter(mission => !mission.deletedAt);
            },
            error => {
                console.log(error);
            }
        );
    }

    add(donnee: any) {
        console.log(donnee);
        this.http.post<any>(`${this.API_URL}`, donnee).subscribe(
            data => {
                this.missions.push(data);
                this.isAdding = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mission ajoutée' });
                this.dataForm.reset();
                this.get();
            },
            error => {
                this.handleError(error)
            }
        );
    }

    edit(id: number, donnee: any) {
        console.log(donnee);
        if (!donnee) {
            console.error('Données invalides', donnee);
            return;
        }
        const url = `${this.API_URL}/${id}`;
        this.http.patch<any>(url, donnee).subscribe(
            data => {
                const index = this.missions.findIndex(
                    r => r._id === data._id
                );
                this.missions[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
                this.dataForm.reset();
                this.get();
            },
            error => {
                console.log(error);
                if (error.error && error.error.message) {
                    console.error('Message d\'erreur du serveur :', error.error.message);
                }
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La modification a échoué' });
            }
        );
    }

    deleteData(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.missions = this.missions.filter(m => m.id !== id);
                this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Missions effacée' });
                this.get();
            },
            error => {
                console.log(error);
            }
        );
    }
    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
        //
    }
    confirmDeleteDeleted(): void {
        // Mettez ici le code pour supprimer définitivement les données supprimées
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe(
            () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complétement effacées' });
                this.get(); // Met à jour la liste
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
            }
        );
        this.displayConfirmationDialog = false;
    }

    selectData(donnee: any) {
        this.selectedData = { ...donnee };
    }


    cancel() {
        this.selectedData = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedData = {};
        this.dataForm?.get('title')?.setValue('');
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }
}
