import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [MessageService],
})
export class DashboardComponent implements OnInit {
    readonly API_URL = `${environment.apiUrl}`;

    agentCount = 0; // Initialise la propriété agentCount à zéro
    ruesCount = 0; // Initialise la propriété agentCount à zéro
    missionsCount = 0; // Initialise la propriété agentCount à zéro
    lastUpdate: Date = new Date(); // initialisation de la propriété
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.lastUpdate = new Date();
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

    clearAll() {
        console.log('Clearing local storage...');
        localStorage.clear();
        console.log('Local storage cleared.');

        console.log('Flushing Redis cache...');
        this.http.post<any>(`http://localhost:3003/flushall`, {}).subscribe(
            response => {
                if (response.status === 200) {
                    console.log('Flush all successful', response);
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Flush all successful',
                });
            },
            error => {
                console.error('Flush all failed', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'error.message',
                });
            }
        );
    }
}
