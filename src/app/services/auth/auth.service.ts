import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/User.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    private apiUrl: string = environment.apiUrl;
    private accessTokenKey: string = 'accessToken'; // Clé pour l'accessToken dans le localStorage
    public accessToken: string | null = null;
    private user: User | null = null;

    login(email: string, password: string): Observable<any> {
        return this.http
            .post<any>(`${this.apiUrl}/login`, {
                email,
                password,
            })
            .pipe(
                map(response => {
                    const { accessToken, user } = response;
                    this.accessToken = accessToken;
                    this.user = user;
                    // Stocker l'accessToken dans le localStorage
                    localStorage.setItem(this.accessTokenKey, accessToken);
                    // console.log('user auth', this.user);
                    return response; // Retourne la réponse inchangée
                })
            );
    }

    register(
        email: string,
        password: string,
        enable: boolean,
        userAccess: number,
        matricule: number
    ): Observable<any> {
        const requestBody = { email, password, enable, userAccess, matricule };
        return this.http.post<any>(`${this.apiUrl}/agents`, requestBody);
    }
    logout() {
        this.accessToken = null;
        this.user = null;
        // Supprimer l'accessToken du localStorage lors de la déconnexion
        localStorage.removeItem(this.accessTokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.accessToken;
    }

    getAccessToken(): string | null {
        // Récupérer l'accessToken depuis le localStorage
        this.accessToken = localStorage.getItem(this.accessTokenKey);
        return this.accessToken;
    }

    getUser(): User | null {
        return this.user;
    }
}
