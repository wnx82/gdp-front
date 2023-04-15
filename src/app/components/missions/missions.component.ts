import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-missions',
    templateUrl: './missions.component.html',
    styleUrls: ['./missions.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class MissionsComponent implements OnInit {
    missions: any[] = [];
    selectedData: any = {};
    isAdding = false;
    isEditing = false;

    displayConfirmationDelete = false;
    displayConfirmationDialog = false;

    dataForm = new FormGroup({
        title: new FormControl(''),
        description: new FormControl(''),
        category: new FormControl(''),
        horaire: new FormControl(''),
        contact: new FormControl(''),
        priority: new FormControl(''),
        visibility: new FormControl(true, [Validators.pattern('true|false')]),
        // annexes: new FormControl(''),
    });
    constructor(private http: HttpClient, private fb: FormBuilder,
        private messageService: MessageService, private confirmationService: ConfirmationService) { }
    readonly API_URL = `${environment.apiUrl}/missions`;
    ngOnInit(): void {
        this.get();
    }
    private handleError(error: any): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }
    get() {
        this.http.get<any[]>(`${this.API_URL}`).subscribe({
            next: data => {
                this.missions = data.filter(mission => !mission.deletedAt);
            },
            error: error => {
                console.log(error);
            }
        });
    }

    add(donnee: any) {
        this.http.post<any>(`${this.API_URL}`, donnee).subscribe({
            next: data => {
                this.missions.push(data);
                this.isAdding = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mission ajoutée' });
                this.dataForm.reset();
                this.get();
            },
            error: error => {
                this.handleError(error)
            }
        });
    }

    edit(id: number, donnee: any) {
        console.log(donnee);
        if (!donnee) {
            console.error('Données invalides', donnee);
            return;
        }
        const updateMission = {

            title: donnee.title !== null ? donnee.title : this.selectedData.title,
            description: donnee.description !== null ? donnee.description : this.selectedData.description,
            category: donnee.category !== null ? donnee.category : this.selectedData.category,
            horaire: donnee.horaire !== null ? donnee.horaire : this.selectedData.horaire,
            contact: donnee.contact !== null ? donnee.contact : this.selectedData.contact,
            priority: donnee.priority !== null ? donnee.priority : this.selectedData.priority,
            visibility: donnee.visibility !== null ? false : true,

            // Ajouter les autres champs de la rue ici si nécessaire
        }; const url = `${this.API_URL}/${id}`;

        this.http.patch<any>(url, updateMission).subscribe({
            next: data => {
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
            error: error => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
            }
        });
    }

    onConfirmDelete(mission: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cette mission ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteData(mission._id);
            }
        });
    }
    deleteData(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.missions = this.missions.filter(m => m.id !== id);
                this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Mission effacée' });
                this.get();
            },
            error: error => {
                console.log(error);
            }
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
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complétement effacées' });
                this.get(); // Met à jour la liste
            },
            error: error => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
            },
            complete: () => {
                this.displayConfirmationDialog = false;
            }
        });
    }


    selectData(donnee: any) {
        console.log(donnee);
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
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }
}
