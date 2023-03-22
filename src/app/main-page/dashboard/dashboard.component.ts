import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    agentCount = 0; // Initialise la propriété agentCount à zéro
    ruesCount = 0; // Initialise la propriété agentCount à zéro
    missionsCount = 0; // Initialise la propriété agentCount à zéro
    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http
            .get<any[]>('http://localhost:3003/agents')
            .subscribe(agents => {
                this.agentCount = agents.length;
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
