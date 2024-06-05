import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Agent } from '../../interfaces/Agent.interface';
import { Habitation } from '../../interfaces/Habitation.interface';
import { Horaire } from '../../interfaces/Horaire.interface';
import { Infraction } from '../../interfaces/Infraction.interface';
import { Mission } from '../../interfaces/Mission.interface';
import { Quartier } from '../../interfaces/Quartier.interface';
import { Rue } from '../../interfaces/Rue.interface.';
import { Vehicule } from '../../interfaces/Vehicule.interface';

@Injectable({
    providedIn: 'root',
})
export class GetDataService {
    private myAgents = new BehaviorSubject<Agent[]>([]);
    private myHabitations = new BehaviorSubject<Habitation[]>([]);
    private myHabitationsActive = new BehaviorSubject<Habitation[]>([]);
    private myHoraires = new BehaviorSubject<Horaire[]>([]);
    private myInfractions = new BehaviorSubject<Infraction[]>([]);
    private myMissions = new BehaviorSubject<Mission[]>([]);
    private myQuartiers = new BehaviorSubject<Quartier[]>([]);
    private myRues = new BehaviorSubject<Rue[]>([]);
    private myVehicules = new BehaviorSubject<Vehicule[]>([]);

    // readonly API_URL = `${environment.apiUrl}/dailies`;

    constructor(private http: HttpClient) {
        this.getAgentsFromApi();
        this.getHabitationsFromApi();
        this.getHabitationsActiveFromApi();
        this.getHorairesFromApi();
        this.getInfractionsFromApi();
        this.getMissionsFromApi();
        this.getQuartierFromApi();
        this.getRueFromApi();
        this.getVehiculeFromApi();
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
    // Listing des habitations actives
    habitationsActive$: Observable<Habitation[]> = this.myHabitationsActive
        .asObservable()
        .pipe(filter(habitations => habitations.length > 0));

    private getHabitationsActiveFromApi() {
        this.http
            .get<Habitation[]>(`${environment.apiUrl}/habitations/active`)
            .subscribe({
                next: data => {
                    this.myHabitationsActive.next(
                        data.filter(habitation => !habitation.deletedAt)
                    );
                },
                error: error => {
                    console.error('Error fetching habitations: ', error);
                },
            });
    }
    // Listing des horaires
    horaires$: Observable<Horaire[]> = this.myHoraires
        .asObservable()
        .pipe(filter(horaires => horaires.length > 0));

    private getHorairesFromApi() {
        this.http.get<Horaire[]>(`${environment.apiUrl}/horaires`).subscribe({
            next: data => {
                this.myHoraires.next(
                    data.filter(horaire => !horaire.deletedAt)
                );
            },
            error: error => {
                console.error('Error fetching horaires: ', error);
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
    // Listing des Vehicules
    vehicules$: Observable<Vehicule[]> = this.myVehicules
        .asObservable()
        .pipe(filter(vehicules => vehicules.length > 0));

    private getVehiculeFromApi() {
        this.http.get<Vehicule[]>(`${environment.apiUrl}/vehicules`).subscribe({
            next: data => {
                this.myVehicules.next(
                    data.filter(vehicule => !vehicule.deletedAt)
                );
            },
            error: error => {
                console.error('Error fetching vehicules: ', error);
            },
        });
    }
}
