import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { formatDate } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private apiUrl: string = `${environment.apiUrl}/register`;

    constructor(private http: HttpClient) {}

    // Vérification de l'utilisateur Enora
    checkUser(email: string, birthday: string): Observable<any> {
        birthday = formatDate(birthday, 'yyyy-MM-dd', 'en-US');
        const body = { email, birthday };
        return this.http
            .post<any>(`${this.apiUrl}/check-my-account`, body)
            .pipe(
                tap(response => {
                    if (response) {
                        // Utilisateur trouvé avec succès
                        localStorage.setItem(
                            'checkout',
                            JSON.stringify({ birthday, ...response })
                        );
                    }
                }),
                catchError(error => {
                    let errorMessage =
                        'Une erreur est survenue. Veuillez réessayer.';
                    if (error.status === 404) {
                        errorMessage =
                            'Utilisateur non trouvé. Veuillez vérifier vos informations ou créer un nouveau compte.';
                    } else if (error.status === 409) {
                        errorMessage =
                            'Utilisateur déjà enregistré. Veuillez vous connecter avec votre compte existant.';
                    } else if (error.status === 0) {
                        errorMessage = "Pas d'accès";
                    }
                    return throwError(errorMessage);
                })
            );
    }

    // Création de l'utilisateur

    createUser(
        password: string,
        id: string,
        email: string,
        birthday: string
    ): Observable<any> {
        const body = { password, email, birthday, id };
        return this.http.post<any>(`${this.apiUrl}/registration`, body).pipe(
            catchError(error => {
                // Vérifier si une erreur réelle s'est produite
                if (error instanceof HttpErrorResponse) {
                    // Une erreur HTTP s'est produite, renvoyer l'erreur
                    return throwError(error);
                } else {
                    // Aucune erreur HTTP détectée, cela signifie que la création de l'utilisateur a réussi
                    return of();
                }
            })
        );
    }

    // Méthode pour gérer le processus d'inscription complet
    registerUser(password: string): Observable<any> {
        // Récupération des données d'utilisateur stockées dans le localStorage
        const userDataString = localStorage.getItem('checkout');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            const { email, birthday, id } = userData;
            // Création de l'utilisateur avec les données récupérées et le mot de passe fourni
            return this.createUser(password, id, email, birthday).pipe(
                catchError(error => {
                    if (error.status === 404) {
                        return throwError({
                            message: 'Utilisateur inconnu',
                            statusCode: 404,
                        });
                    } else if (error.status === 400) {
                        return throwError({
                            message: 'Requête invalide',
                            statusCode: 400,
                        });
                    } else {
                        // Autre erreur, renvoyer l'erreur d'origine
                        return throwError(error);
                    }
                })
            );
        } else {
            return throwError(
                'Données utilisateur introuvables dans le localStorage'
            );
        }
    }
}
