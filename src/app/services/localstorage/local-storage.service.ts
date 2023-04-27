import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}/rues`;

    // Stocke une valeur dans le LocalStorage
    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Récupère une valeur depuis le LocalStorage
    getItem(key: string): any {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    // Supprime une valeur du LocalStorage
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    // Efface complètement le LocalStorage
    clear(): void {
        localStorage.clear();
    }

    getRues(): any[] {
        const ruesLocalStorage = localStorage.getItem('rues');
        if (ruesLocalStorage === null) {
            // Si les rues n'existent pas encore dans le local storage
            this.http.get<any[]>(this.API_URL).subscribe(
                data => {
                    localStorage.setItem('rues', JSON.stringify(data));
                    console.log('Sauvegarde des rues dans le local storage');
                    return data;
                },
                error => {
                    console.error(error);
                    return [];
                }
            );
        } else {
            // Les rues existent dans le local storage
            console.log('Rues déjà chargées depuis le local storage');
            const ruesServeurPromise = this.http
                .get<any[]>(this.API_URL)
                .toPromise();
            const ruesLocalStorageParsed = JSON.parse(ruesLocalStorage);
            ruesServeurPromise
                .then(ruesServeurParsed => {
                    if (
                        ruesServeurParsed &&
                        ruesServeurParsed.length !==
                            ruesLocalStorageParsed.length
                    ) {
                        localStorage.setItem(
                            'rues',
                            JSON.stringify(ruesServeurParsed)
                        );
                        console.log(
                            'Les rues en localStorage ont été remplacées par celles du serveur'
                        );
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            return ruesLocalStorageParsed;
        }
        return [];
    }

    getAgents(): any[] {
        const agentsLocalStorage = localStorage.getItem('agents');
        if (agentsLocalStorage === null) {
            // Si les agents n'existent pas encore dans le local storage
            this.http.get<any[]>(this.API_URL).subscribe(
                data => {
                    localStorage.setItem('agents', JSON.stringify(data));
                    console.log('Sauvegarde des agents dans le local storage');
                    return data;
                },
                error => {
                    console.error(error);
                    return [];
                }
            );
        } else {
            // Les agents existent dans le local storage
            console.log('Agents déjà chargés depuis le local storage');
            return JSON.parse(agentsLocalStorage);
        }
        return [];
    }
}
