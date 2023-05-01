import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Infraction } from 'src/app/interfaces/Infraction.interface';
@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html',
    styleUrls: ['./infractions.component.css'],
    providers: [MessageService],
})
export class InfractionsComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    donnees: Infraction[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        category: new FormControl('', [Validators.required]),
        priority: new FormControl(''),
        list: new FormControl(''),
    });
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}
    readonly API_URL = `${environment.apiUrl}/infractions`;
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

    get() {
        this.http.get<Infraction[]>(this.API_URL).subscribe({
            next: data => {
                this.donnees = data.filter(donnee => !donnee.deletedAt);
                // console.log(this.donnees);
            },
            error: error => {
                console.log(error);
            },
        });
    }
    formatList(list: any[]): string {
        return list.map(item => item.join(',')).join('\n');
    }

    add(donnee: any) {
        this.http.post<Infraction>(`${this.API_URL}`, donnee).subscribe({
            next: data => {
                this.donnees.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Donnée ajouté',
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

        this.http.patch<Infraction>(url, donnee).subscribe({
            next: data => {
                const index = this.donnees.findIndex(a => a._id === data._id);
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
        this.http.delete<Infraction>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.donnees = this.donnees.filter(a => a._id !== id);
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
        console.log({ ...donnee });
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
        // console.log(this.selectedData);
    }
    clear(table: Table) {
        table.clear();
    }
}
