import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-rues',
    templateUrl: './rues.component.html',
    styleUrls: ['./rues.component.css'],
})
export class RuesComponent implements OnInit {
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

    ngOnInit() {
        this.getRues();
    }

    onPageChange(event: { page: number }) {
        this.currentPage = event.page + 1;
        this.getRues();
    }

    getRues() {
        let url = `http://localhost:3003/rues/?page=${this.currentPage}&pageSize=${this.itemsPerPage}`;

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
        this.http.post<any>('http://localhost:3003/rues/', rue).subscribe(
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
        if (!rue._id) {
            console.log(
                "L'identifiant de la rue à mettre à jour est manquant ou invalide !"
            );
            return;
        }
        const { _id, ...rueToUpdate } = rue;
        this.http
            .patch<any>(`http://localhost:3003/rues/${_id}`, rueToUpdate)
            .subscribe(
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
        this.http.delete<any>(`http://localhost:3003/rues/${id}`).subscribe(
            () => {
                this.rues = this.rues.filter(r => r.id !== id);
                this.getRues();
            },
            error => {
                console.log(error);
            }
        );
    }

    selectRue(rue: any) {
        this.selectedRue = { ...rue };
        console.log(this.selectedRue);
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