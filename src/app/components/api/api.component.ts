import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.css'],
    providers: [ConfirmationService],
})
export class ApiComponent implements OnInit {
    readonly API_URL = `${environment.apiUrl}/logs`;

    logs: string[] = [];
    displayConfirmationDelete = false;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}
    ngOnInit() {
        this.getLogs();
    }

    getLogs() {
        this.http.get<string[]>(this.API_URL).subscribe(
            data => {
                this.logs = data;
            },
            (error: HttpErrorResponse) => {
                console.error('Error retrieving logs:', error);
                console.error('Error message:', error.error);
            }
        );
    }

    onConfirm() {
        this.displayConfirmationDelete = false;
        this.http.delete<string[]>(this.API_URL).subscribe(
            () => {
                console.log(
                    'Le contenu du fichier access.log a été effacé avec succès.'
                );
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Fichier access.log effacé',
                });
                this.getLogs(); // Recharge la liste des logs après la suppression
            },
            (error: HttpErrorResponse) => {
                console.error(
                    "Erreur lors de l'effacement du contenu du fichier:",
                    error
                );
            }
        );
    }

    onReject() {
        // Ne rien faire
    }

    confirmDeleteLogs() {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message:
                'Êtes-vous sûr de vouloir supprimer le contenu du fichier access.log ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.onConfirm();
            },
            reject: () => {
                this.onReject();
            },
        });
    }
}
