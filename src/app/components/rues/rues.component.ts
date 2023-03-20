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

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.getRues();
    }

    getRues() {
        this.http.get<any[]>('http://localhost:3003/rues/').subscribe(
            data => {
                this.rues = data;
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
        this.http
            .put<any>(`http://localhost:3003/rues/${rue.id}`, rue)
            .subscribe(
                data => {
                    const index = this.rues.findIndex(r => r.id === data.id);
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
}
