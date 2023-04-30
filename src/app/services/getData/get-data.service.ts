import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { merge, Subject } from 'rxjs';
import { map, takeUntil, catchError, scan } from 'rxjs/operators';
import { Agent } from 'src/app/interfaces/Agent.interface';
import { Mission } from 'src/app/interfaces/Mission.interface';
import { Quartier } from 'src/app/interfaces/Quartier.interface';
import { Rue } from 'src/app/interfaces/Rue.interface.';

@Injectable({
    providedIn: 'root',
})
export class GetDataService {
    constructor(private http: HttpClient) {
        this.getAgentsFromApi();
        this.getMissionsFromApi();
        this.getQuartierFromApi();
    }
    private myData = new BehaviorSubject<string>('Initial value');
    private myAgents = new BehaviorSubject<Agent[]>([]);
    private myMissions = new BehaviorSubject<Mission[]>([]);
    private myQuartiers = new BehaviorSubject<Quartier[]>([]);
    private apiUrl: string | undefined;
    readonly API_URL = `${environment.apiUrl}/dailies`;

    //Listing des agents
    public agents$: Observable<Agent[]> = this.myAgents.asObservable();
    private getAgentsFromApi() {
        this.http.get<Agent[]>(`${environment.apiUrl}/agents`).subscribe({
            next: data => {
                this.myAgents.next(data.filter(agent => !agent.deletedAt));
            },
            error: error => {
                console.log('Error fetching agents: ', error);
            },
        });
    }
    // Expose la propriété missions$ publique de la classe
    get agents(): Observable<Agent[]> {
        return this.agents$;
    }
    //Listing des missions
    public missions$: Observable<Mission[]> = this.myMissions.asObservable();
    private getMissionsFromApi() {
        this.http.get<Mission[]>(`${environment.apiUrl}/missions`).subscribe({
            next: data => {
                this.myMissions.next(
                    data.filter(quartier => !quartier.deletedAt)
                );
            },
            error: error => {
                console.log('Error fetching missions: ', error);
            },
        });
    }
    // Expose la propriété missions$ publique de la classe
    get missions(): Observable<Mission[]> {
        return this.missions$;
    }
    //Listing des quartiers
    public quartiers$: Observable<Quartier[]> = this.myQuartiers.asObservable();
    private getQuartierFromApi() {
        this.http.get<Quartier[]>(`${environment.apiUrl}/quartiers`).subscribe({
            next: data => {
                this.myQuartiers.next(
                    data.filter(quartier => !quartier.deletedAt)
                );
            },
            error: error => {
                console.log('Error fetching quartiers: ', error);
            },
        });
    }
    // Expose la propriété quartiers$ publique de la classe
    get quartiers(): Observable<Quartier[]> {
        return this.quartiers$;
    }

    updateData(newData: string) {
        this.myData.next(newData);
    }
}
