import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.css'],
})
export class ApiComponent implements OnInit {
    readonly API_URL = `${environment.apiUrl}/logs`;

    logs: string[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.getLogs();
    }

    getLogs() {
        this.http.get<string[]>(this.API_URL).subscribe(
            data => {
                this.logs = data;
                // console.log('logs', this.logs);
            },
            (error: HttpErrorResponse) => {
                console.error('Error retrieving logs:', error);
                console.error('Error message:', error.error);
            }
        );
    }
}
