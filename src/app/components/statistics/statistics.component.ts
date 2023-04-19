import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
    agentCount = 0; // Initialise la propriété agentCount à zéro
    categoriesCount = 0; // Initialise la propriété categoriesCount à zéro
    constatsCount = 0; // Initialise la propriété constatsCount à zéro
    horairesCount = 0; // Initialise la propriété horairesCount à zéro
    infractionsCount = 0; // Initialise la propriété infractionsCount à zéro
    missionsCount = 0; // Initialise la propriété missionsCount à zéro
    quartiersCount = 0; // Initialise la propriété quartiersCount à zéro
    ruesCount = 0; // Initialise la propriété ruesCount à zéro
    vehiculesCount = 0; // Initialise la propriété vehiculesCount à zéro
    lastUpdate: Date = new Date(); // Initialise la propriété lastUpdate avec la date et l'heure actuelles.

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.lastUpdate = new Date();
        this.http
            .get<any[]>('http://localhost:3003/agents')
            .subscribe(agents => {
                this.agentCount = agents.length;
            });
        this.http
            .get<any[]>('http://localhost:3003/categories')
            .subscribe(categories => {
                this.categoriesCount = categories.length;
            });
        this.http
            .get<any[]>('http://localhost:3003/constats')
            .subscribe(constats => {
                this.constatsCount = constats.length;
            });
        this.http
            .get<any[]>('http://localhost:3003/horaires')
            .subscribe(horaires => {
                this.horairesCount = horaires.length;
            });
        this.http
            .get<any[]>('http://localhost:3003/infractions')
            .subscribe(infractions => {
                this.infractionsCount = infractions.length;
            });

        this.http
            .get<any[]>('http://localhost:3003/missions')
            .subscribe(missions => {
                this.missionsCount = missions.length;
            });
        this.http
            .get<any[]>('http://localhost:3003/quartiers')
            .subscribe(quartiers => {
                this.quartiersCount = quartiers.length;
            });
        this.http.get<any[]>('http://localhost:3003/rues').subscribe(rues => {
            this.ruesCount = rues.length;
        });
        this.http
            .get<any[]>('http://localhost:3003/vehicules')
            .subscribe(vehicules => {
                this.vehiculesCount = vehicules.length;
            });
    }
}
