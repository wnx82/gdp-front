import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Agent } from 'src/app/interfaces/Agent.interface';
import { Habitation } from 'src/app/interfaces/Habitation.interface';
import { Infraction } from 'src/app/interfaces/Infraction.interface';
import { Mission } from 'src/app/interfaces/Mission.interface';
import { Quartier } from 'src/app/interfaces/Quartier.interface';
import { Rue } from 'src/app/interfaces/Rue.interface.';

@Injectable({
    providedIn: 'root',
})
export class GetDataService {
    private myAgents = new BehaviorSubject<Agent[]>([]);
    private myHabitations = new BehaviorSubject<Habitation[]>([]);
    private myInfractions = new BehaviorSubject<Infraction[]>([]);
    private myMissions = new BehaviorSubject<Mission[]>([]);
    private myQuartiers = new BehaviorSubject<Quartier[]>([]);
    private myRues = new BehaviorSubject<Rue[]>([]);

    readonly API_URL = `${environment.apiUrl}/dailies`;

    constructor(private http: HttpClient) {
        this.getAgentsFromApi();
        this.getHabitationsFromApi();
        this.getInfractionsFromApi();
        this.getMissionsFromApi();
        this.getQuartierFromApi();
        this.getRueFromApi();
    }

    // Listing des agents
    agents$: Observable<Agent[]> = this.myAgents
        .asObservable()
        .pipe(filter(agents => agents.length > 0));

    private getAgentsFromApi() {
        this.http.get<Agent[]>(`${environment.apiUrl}/agents`).subscribe({
            next: data => {
                this.myAgents.next(data.filter(agent => !agent.deletedAt));
            },
            error: error => {
                console.error('Error fetching agents: ', error);
            },
        });
    }

    // Listing des habitations
    habitations$: Observable<Habitation[]> = this.myHabitations
        .asObservable()
        .pipe(filter(habitations => habitations.length > 0));

    private getHabitationsFromApi() {
        this.http
            .get<Habitation[]>(`${environment.apiUrl}/habitations`)
            .subscribe({
                next: data => {
                    this.myHabitations.next(
                        data.filter(habitation => !habitation.deletedAt)
                    );
                },
                error: error => {
                    console.error('Error fetching habitations: ', error);
                },
            });
    }
    // Listing des infractions
    infractions$: Observable<Infraction[]> = this.myInfractions
        .asObservable()
        .pipe(filter(infractions => infractions.length > 0));

    private getInfractionsFromApi() {
        this.http
            .get<Infraction[]>(`${environment.apiUrl}/infractions`)
            .subscribe({
                next: data => {
                    this.myInfractions.next(
                        data.filter(infraction => !infraction.deletedAt)
                    );
                },
                error: error => {
                    console.error('Error fetching infractions: ', error);
                },
            });
    }

    // Listing des missions
    missions$: Observable<Mission[]> = this.myMissions
        .asObservable()
        .pipe(filter(missions => missions.length > 0));

    private getMissionsFromApi() {
        this.http.get<Mission[]>(`${environment.apiUrl}/missions`).subscribe({
            next: data => {
                this.myMissions.next(
                    data.filter(mission => !mission.deletedAt)
                );
            },
            error: error => {
                console.error('Error fetching missions: ', error);
            },
        });
    }

    // Listing des quartiers
    quartiers$: Observable<Quartier[]> = this.myQuartiers
        .asObservable()
        .pipe(filter(quartiers => quartiers.length > 0));

    private getQuartierFromApi() {
        this.http.get<Quartier[]>(`${environment.apiUrl}/quartiers`).subscribe({
            next: data => {
                this.myQuartiers.next(
                    data.filter(quartier => !quartier.deletedAt)
                );
            },
            error: error => {
                console.error('Error fetching quartiers: ', error);
            },
        });
    }

    // Listing des Rues
    rues$: Observable<Rue[]> = this.myRues
        .asObservable()
        .pipe(filter(rues => rues.length > 0));

    private getRueFromApi() {
        this.http.get<Rue[]>(`${environment.apiUrl}/rues`).subscribe({
            next: data => {
                this.myRues.next(data.filter(rue => !rue.deletedAt));
            },
            error: error => {
                console.error('Error fetching rues: ', error);
            },
        });
    }
}
