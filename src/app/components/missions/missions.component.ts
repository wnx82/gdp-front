import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-missions',
    templateUrl: './missions.component.html',
    styleUrls: ['./missions.component.css'],
})
export class MissionsComponent implements OnInit {
    missions: any[] = [];
    selectedMission: any = {};
    isAdding = false;
    isEditing = false;
    title: string = '';
    description: string = '';
    category: string = '';
    horaire: string = '';
    contact: string = '';
    visibility: boolean = false;
    annexes: string[] = [];
    createdAt: string = '';
    updatedAt: string = '';

    constructor(private http: HttpClient) {}
    readonly BASE_URL = 'http://localhost:3003/missions';
    // url = 'http://localhost:3003/missions/';

    ngOnInit() {
        this.getMissions();
    }

    getMissions() {
        this.http.get<any[]>(`${this.BASE_URL}`).subscribe(
            data => {
                this.missions = data.filter(mission => !mission.deletedAt);
            },
            error => {
                console.log(error);
            }
        );
    }

    addMission(mission: any) {
        this.http.post<any>(`${this.BASE_URL}`, mission).subscribe(
            data => {
                this.missions.push(data);
                this.isAdding = false;
                this.getMissions();
            },
            error => {
                console.log(error);
            }
        );
    }

    // editMission(mission: Mission) {
    //     this.http
    //         .put<Mission>(`${this.BASE_URL}${mission.id}`, mission)
    //         .pipe(
    //             map(data => {
    //                 const index = this.missions.findIndex(
    //                     m => m.id === data.id
    //                 );
    //                 this.missions[index] = data;
    //                 this.selectedMission = {} as Mission;
    //             }),
    //             catchError(error => throwError(error))
    //         )
    //         .subscribe(() => {
    //             this.isEditing = false;
    //         });
    // }
    editMission(mission: any) {
        this.http
            .patch<any>(`${this.BASE_URL}/${mission.id}`, mission)
            .subscribe(
                data => {
                    const index = this.missions.findIndex(
                        r => r._id === data._id
                    );
                    this.missions[index] = data;
                    this.selectedMission = {};
                    this.isEditing = false;
                },
                error => {
                    console.log(error);
                }
            );
    }
    // deleteMission(id: number) {
    //   this.http.delete<Mission>(`${this.BASE_URL}${id}`).pipe(
    //     map(() => (this.missions = this.missions.filter(m => m.id !== id))),
    //     catchError(error => throwError(error))
    //   ).subscribe();
    // }
    deleteMission(id: number) {
        this.http.delete<any>(`${this.BASE_URL}/${id}`).subscribe(
            () => {
                this.missions = this.missions.filter(m => m.id !== id);
                this.getMissions();
            },
            error => {
                console.log(error);
            }
        );
    }
    selectMission(mission: any) {
        this.selectedMission = { ...mission };
    }

    cancel() {
        this.selectedMission = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedMission = {};
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }
}
