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

    displayedLogs: string[] = []; // Logs à afficher pour la page actuelle
    itemsPerPage: number = 50; // Nombre de logs par page
    firstItemIndex: number = 0; // Index du premier log sur la page actuelle

    onPageChange(event: any) {
        this.firstItemIndex = event.first;
        this.displayedLogs = this.logs.slice(
            event.first,
            event.first + event.rows
        );
    }
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
                this.getDisplayedLogs(); // Met à jour les logs paginés après la récupération
            },
            (error: HttpErrorResponse) => {
                console.error('Error retrieving logs:', error);
                console.error('Error message:', error.error);
            }
        );
    }

    getDisplayedLogs() {
        const totalLogs = this.logs.length;
        const lastItemIndex = this.firstItemIndex + this.itemsPerPage;
        this.displayedLogs = this.logs.slice(
            this.firstItemIndex,
            lastItemIndex > totalLogs ? totalLogs : lastItemIndex
        );

        if (totalLogs >= 20 * this.itemsPerPage) {
            //A 20 pages de logs, lancer delete
            this.confirmDeleteLogs();
        }
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

    getDisplayRange(): string {
        const lastItemIndex = this.firstItemIndex + this.displayedLogs.length;
        return `Affichage de ${
            this.firstItemIndex + 1
        } à ${lastItemIndex} sur ${this.logs.length} entrées`;
    }
}
