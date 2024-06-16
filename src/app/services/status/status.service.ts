import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StatusService {
    private apiUrl: string = `${environment.apiUrl}/status`;

    constructor(private http: HttpClient) {}

    // Méthode pour vérifier le statut des bases de données MongoDB et Redis
    checkDatabaseStatus(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage =
                    'Une erreur est survenue lors de la vérification du statut de la base de données.';
                if (error.status === 500) {
                    errorMessage =
                        'Erreur interne du serveur lors de la vérification du statut de la base de données.';
                }
                return throwError(errorMessage);
            })
        );
    }
}
