import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-globalStats',
    templateUrl: './globalStats.component.html',
    styleUrls: ['./globalStats.component.scss'],
})
export class globalStats {
    agentCount = 0; // Initialise la propriété agentCount à zéro
    articlesCount = 0; // Initialise la propriété articlesCount à zéro
    categoriesCount = 0; // Initialise la propriété categoriesCount à zéro
    constatsCount = 0; // Initialise la propriété constatsCount à zéro
    dailiesCount = 0; // Initialise la propriété dailiesCount à zéro
    horairesCount = 0; // Initialise la propriété horairesCount à zéro
    infractionsCount = 0; // Initialise la propriété infractionsCount à zéro
    missionsCount = 0; // Initialise la propriété missionsCount à zéro
    quartiersCount = 0; // Initialise la propriété quartiersCount à zéro
    rapportsCount = 0; // Initialise la propriété rapportsCount à zéro
    ruesCount = 0; // Initialise la propriété ruesCount à zéro
    vehiculesCount = 0; // Initialise la propriété vehiculesCount à zéro
    lastUpdate: Date = new Date(); // Initialise la propriété lastUpdate avec la date et l'heure actuelles.

    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}`;
    ngOnInit() {
        this.lastUpdate = new Date();

        this.http.get<any[]>(`${this.API_URL}/agents`).subscribe(agents => {
            this.agentCount = agents.length;
        });
        this.http.get<any[]>(`${this.API_URL}/articles`).subscribe(articles => {
            this.articlesCount = articles.length;
        });
        this.http
            .get<any[]>(`${this.API_URL}/categories`)
            .subscribe(categories => {
                this.categoriesCount = categories.length;
            });
        this.http.get<any[]>(`${this.API_URL}/constats`).subscribe(constats => {
            this.constatsCount = constats.length;
        });
        this.http.get<any[]>(`${this.API_URL}/dailies`).subscribe(dailies => {
            this.dailiesCount = dailies.length;
        });
        this.http.get<any[]>(`${this.API_URL}/horaires`).subscribe(horaires => {
            this.horairesCount = horaires.length;
        });
        this.http
            .get<any[]>(`${this.API_URL}/infractions`)
            .subscribe(infractions => {
                this.infractionsCount = infractions.length;
            });

        this.http.get<any[]>(`${this.API_URL}/missions`).subscribe(missions => {
            this.missionsCount = missions.length;
        });
        this.http
            .get<any[]>(`${this.API_URL}/quartiers`)
            .subscribe(quartiers => {
                this.quartiersCount = quartiers.length;
            });
        this.http.get<any[]>(`${this.API_URL}/rapports`).subscribe(rapports => {
            this.rapportsCount = rapports.length;
        });
        this.http.get<any[]>(`${this.API_URL}/rues`).subscribe(rues => {
            this.ruesCount = rues.length;
        });
        this.http
            .get<any[]>(`${this.API_URL}/vehicules`)
            .subscribe(vehicules => {
                this.vehiculesCount = vehicules.length;
            });
    }
}
