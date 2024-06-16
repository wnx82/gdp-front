import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { GetDataService } from '../../../services/getData/get-data.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    connectedUsers: any[] = [];
    dataLoaded: boolean = false;
    // dataLoaded = false; // flag to keep track of whether data is loaded or not
    // agentCount = 0; // Initialise la propriété agentCount à zéro
    // ruesCount = 0; // Initialise la propriété agentCount à zéro
    // missionsCount = 0; // Initialise la propriété agentCount à zéro
    // lastUpdate: Date = new Date(); // initialisation de la propriété
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService
    ) {}
    readonly API_URL = `${environment.apiUrl}`;
    ngOnInit() {
        this.getDataService.connectedUsers$.subscribe(users => {
            this.connectedUsers = users;
            this.dataLoaded = true;
        });
        setTimeout(() => {
            this._localStorageService.getAll();
            this.dataLoaded = true; //
        }, 250);
    }

    clearAll() {
        console.log('Clearing local storage...');
        localStorage.clear();
        console.log('Local storage cleared.');

        console.log('Flushing Redis cache...');
        this.http.post<any>(`${this.API_URL}/flushall`, {}).subscribe(
            response => {
                if (response.status === 200) {
                    console.log('Flush all successfully', response);
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Flush all successful',
                });
                this.messageService.add({
                    severity: 'info',
                    summary: 'info',
                    detail: 'Localstorage successfully cleared',
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
