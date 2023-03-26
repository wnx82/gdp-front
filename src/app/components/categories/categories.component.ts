import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    donnees: any[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}/categories`;
    ngOnInit(): void {
        this.get();
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
            },
            error => {
                console.log(error);
            }
        );
        this.get();
    }
    edit(donnee: any) {
        const url = `${this.API_URL}/${donnee.id}`;

        this.http.patch<any>(url, donnee).subscribe(
            data => {
                const index = this.donnees.findIndex(a => a._id === data._id);
                this.donnees[index] = data;
                this.selectedData = {};
                this.isEditing = false;
            },
            error => {
                console.log(error);
            }
        );
    }
    deleteDonnee(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.donnees = this.donnees.filter(a => a.id !== id);
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
                console.log(
                    'Les données supprimées ont été supprimées définitivement.'
                );
                this.get(); // Met à jour la liste
            },
            error => {
                console.log(error);
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
