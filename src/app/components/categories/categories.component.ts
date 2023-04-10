import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
    providers: [MessageService]
})
export class CategoriesComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    donnees: any[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    constructor(private http: HttpClient, private messageService: MessageService) { }
    readonly API_URL = `${environment.apiUrl}/categories`;
    ngOnInit(): void {
        this.get();
    }
    private handleError(error: any): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }

    get() {
        let url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe(
            data => {
                this.donnees = data.filter(donnee => !donnee.deletedAt);

            },
            error => {
                console.log(error);
            }
        );
    }
    add(donnee: any) {
        this.http.post<any>(`${this.API_URL}`, donnee).subscribe(
            data => {
                this.donnees.push(data);
                this.isAdding = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Catégorie ajoutée' });
                this.get();
            },
            (error: any) => {
                this.handleError(error);
            }
        );

    }
    // edit(donnee: any) {
    //     const url = `${this.API_URL}/${donnee._id}`;

    //     this.http.patch<any>(url, donnee).subscribe(
    //         data => {
    //             const index = this.donnees.findIndex(a => a._id === data._id);
    //             this.donnees[index] = data;
    //             this.selectedData = {};
    //             this.isEditing = false;
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     );
    // }
    edit(id: number, donnee: any) {
        if (!donnee || !donnee.id) {
            console.error('Données invalides', donnee);
            return;
        }
        const url = `${this.API_URL}/${id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        this.http.put<any>(url, donnee, { headers }).subscribe(
            data => {
                // console.log('Réponse de l\'API :', data);
                const index = this.donnees.findIndex(a => a.id === data.id);
                this.donnees[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
                this.get()
            },
            error => {
                console.error('Erreur de requête put', error);
                if (error.error && error.error.message) {
                    console.error('Message d\'erreur du serveur :', error.error.message);
                }
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La modification a échoué' });
            }
        );
    }





    deleteDonnee(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.donnees = this.donnees.filter(a => a.id !== id);
                this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Catégorie effacée' });
                this.get();
            },
            error => {
                console.log(error);
            }
        );
    }
    deleteDeleted() {
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
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        console.log(this.selectedData);
    }
}
