import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Mission {
    id: number;
    title: string;
    description: string;
    category: string;
    horaire: string;
    priority: number;
    contact: string;
    visibility: boolean;
    annexes: string[];
    createdAt: string;
    updatedAt: string;
}

@Component({
    selector: 'app-missions',
    templateUrl: './missions.component.html',
    styleUrls: ['./missions.component.css'],
})
export class MissionsComponent implements OnInit {
    missions: Mission[] = [];
    selectedMission: Mission = {} as Mission;
    isAdding = false;
    isEditing = false;

    constructor(private http: HttpClient) {}

    readonly BASE_URL = 'http://localhost:3003/missions/';

    ngOnInit() {
        this.getMissions();
    }

    getMissions() {
        this.http
            .get<Mission[]>(this.BASE_URL)
            .pipe(
                map(data => (this.missions = data)),
                catchError(error => throwError(error))
            )
            .subscribe();
    }

    addMission(mission: Mission) {
        this.http
            .post<Mission>(this.BASE_URL, mission)
            .pipe(
                map(data => this.missions.push(data)),
                catchError(error => throwError(error))
            )
            .subscribe(() => {
                this.isAdding = false;
            });
    }

    editMission(mission: Mission) {
        this.http
            .put<Mission>(`${this.BASE_URL}${mission.id}`, mission)
            .pipe(
                map(data => {
                    const index = this.missions.findIndex(
                        m => m.id === data.id
                    );
                    this.missions[index] = data;
                    this.selectedMission = {} as Mission;
                }),
                catchError(error => throwError(error))
            )
            .subscribe(() => {
                this.isEditing = false;
            });
    }

    // deleteMission(id: number) {
    //   this.http.delete<Mission>(`${this.BASE_URL}${id}`).pipe(
    //     map(() => (this.missions = this.missions.filter(m => m.id !== id))),
    //     catchError(error => throwError(error))
    //   ).subscribe();
    // }
    deleteMission(id: number) {
        this.http.delete<Mission>(`${this.BASE_URL}/${id}`).subscribe(
            () => {
                this.missions = this.missions.filter(m => m.id !== id);
            },
            error => {
                console.log(error);
            }
        );
    }
    selectMission(mission: Mission) {
        this.selectedMission = { ...mission };
    }

    cancel() {
        this.selectedMission = {} as Mission;
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedMission = {} as Mission;
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }
}
