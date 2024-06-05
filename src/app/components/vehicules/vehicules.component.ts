import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-vehicules',
    templateUrl: './vehicules.component.html',
    styleUrls: ['./vehicules.component.css'],
    providers: [MessageService],
})
export class VehiculesComponent {
    private apiUrl: string = environment.apiUrl;
    donnees: any[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        marque: new FormControl(''),
        modele: new FormControl(''),
        immatriculation: new FormControl(''),
    });
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}
    readonly API_URL = `${environment.apiUrl}/vehicules`;
    ngOnInit(): void {
        this.get();
    }
    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }
    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
      }
    
    
    get() {
        this.http.get<any[]>(this.API_URL).subscribe({
            next: data => {
                this.donnees = data.filter(donnee => !donnee.deletedAt);
            },
            error: error => {
                console.log(error);
            },
        });
    }

    add(donnee: any) {
        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
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
            },
        });
    }

    edit(id: number, donnee: any) {
        if (!donnee) {
            console.error('Données invalides', donnee);
            return;
        }
        const url = `${this.API_URL}/${id}`;

        this.http.patch<any>(url, this.dataForm.value).subscribe({
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
                    detail: 'La modification a échoué',
                });
            },
        });
    }

    deleteDonnee(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
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
            marque: donnee?.marque,
            modele: donnee?.modele,
            immatriculation: donnee?.immatriculation,
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
}
