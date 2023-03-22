import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-rues',
    templateUrl: './rues.component.html',
    styleUrls: ['./rues.component.css'],
})
export class RuesComponent implements OnInit {
    private apiUrl: string | undefined;
    rues: any[] = [];
    selectedRue: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    currentPage: number = 1;
    itemsPerPage: number = 50;
    localite: string = '';
    cp: string = '';
    nom: string = '';
    quartier: string = '';

    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}/rues`;

    ngOnInit() {
        this.getRues();
    }

    onPageChange(event: { page: number }) {
        this.currentPage = event.page + 1;
        this.getRues();
    }

    getRues() {
        let url = `${this.API_URL}/?page=${this.currentPage}&pageSize=${this.itemsPerPage}`;

        if (this.localite) {
            url += `&localite=${this.localite}`;
        }

        if (this.cp) {
            url += `&cp=${this.cp}`;
        }

        if (this.nom) {
            url += `&nom=${this.nom}`;
        }

        if (this.quartier) {
            url += `&quartier=${this.quartier}`;
        }

        // this.http.get<any[]>(url).subscribe(
        //     data => {
        //         this.rues = data;
        //     },
        //     error => {
        //         console.log(error);
        //     }
        // );
        this.http.get<any[]>(url).subscribe(
            data => {
                this.rues = data.filter(rue => !rue.deletedAt);
            },
            error => {
                console.log(error);
            }
        );
    }
    addRue(rue: any) {
        this.http.post<any>(`${this.API_URL}`, rue).subscribe(
            data => {
                this.rues.push(data);
                this.isAdding = false;
            },
            error => {
                console.log(error);
            }
        );
    }

    editRue(rue: any) {
        const url = `${this.API_URL}/${rue.id}`;

        this.http.patch<any>(url, rue).subscribe(
            data => {
                const index = this.rues.findIndex(r => r._id === data._id);
                this.rues[index] = data;
                this.selectedRue = {};
                this.isEditing = false;
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteRue(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.rues = this.rues.filter(r => r.id !== id);
                this.getRues();
            },
            error => {
                console.log(error);
            }
        );
    }
    deleteDeletedRues() {
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe(
            () => {
                console.log(
                    'Les rues supprimées ont été supprimées définitivement.'
                );
                this.getRues(); // Met à jour la liste des rues affichées
            },
            error => {
                console.log(error);
            }
        );
    }

    selectRue(rue: any) {
        this.selectedRue = { ...rue };
    }

    cancel() {
        this.selectedRue = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedRue = {};
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    search() {
        this.currentPage = 1;
        this.getRues();
    }
}
