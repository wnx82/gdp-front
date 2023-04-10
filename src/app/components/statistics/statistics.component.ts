import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
    agentCount = 0; // Initialise la propriété agentCount à zéro
    categoriesCount = 0; // Initialise la propriété agentCount à zéro
    ruesCount = 0; // Initialise la propriété agentCount à zéro
    missionsCount = 0; // Initialise la propriété agentCount à zéro
    lastUpdate: Date = new Date(); // initialisation de la propriété
    constructor(private http: HttpClient) { }

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
        this.http.get<any[]>('http://localhost:3003/rues').subscribe(rues => {
            this.ruesCount = rues.length;
        });
        this.http
            .get<any[]>('http://localhost:3003/missions')
            .subscribe(missions => {
                this.missionsCount = missions.length;
            });
    }
}
