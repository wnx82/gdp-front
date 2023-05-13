import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}`;

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

    getAll() {
        this.getRues();
        // this.getAgents();
        // this.getQuartiers();
        // this.getMissions();
    }
    getRues(): any[] {
        const ruesLocalStorage = localStorage.getItem('rues');
        if (ruesLocalStorage === null) {
            // Si les rues n'existent pas encore dans le local storage
            this.http.get<any[]>(`${this.API_URL}/rues`).subscribe(
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
                .get<any[]>(`${this.API_URL}/rues`)
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
            this.http.get<any[]>(`${this.API_URL}/agents`).subscribe(
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
            console.log('Agents déjà chargées depuis le local storage');
            const agentsServeurPromise = this.http
                .get<any[]>(`${this.API_URL}/agents`)
                .toPromise();
            const agentsLocalStorageParsed = JSON.parse(agentsLocalStorage);
            agentsServeurPromise
                .then(agentsServeurParsed => {
                    if (
                        agentsServeurParsed &&
                        agentsServeurParsed.length !==
                            agentsLocalStorageParsed.length
                    ) {
                        localStorage.setItem(
                            'agents',
                            JSON.stringify(agentsServeurParsed)
                        );
                        console.log(
                            'Les agents en localStorage ont été remplacées par celles du serveur'
                        );
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            return agentsLocalStorageParsed;
        }
        return [];
    }
    getQuartiers(): any[] {
        const quartiersLocalStorage = localStorage.getItem('quartiers');
        if (quartiersLocalStorage === null) {
            // Si les quartiers n'existent pas encore dans le local storage
            this.http.get<any[]>(`${this.API_URL}/quartiers`).subscribe(
                data => {
                    localStorage.setItem('quartiers', JSON.stringify(data));
                    console.log(
                        'Sauvegarde des quartiers dans le local storage'
                    );
                    return data;
                },
                error => {
                    console.error(error);
                    return [];
                }
            );
        } else {
            // Les quartiers existent dans le local storage
            console.log('Quartiers déjà chargés depuis le local storage');
            const quartiersServeurPromise = this.http
                .get<any[]>(`${this.API_URL}/quartiers`)
                .toPromise();
            const quartiersLocalStorageParsed = JSON.parse(
                quartiersLocalStorage
            );
            quartiersServeurPromise
                .then(quartiersServeurParsed => {
                    if (
                        quartiersServeurParsed &&
                        quartiersServeurParsed.length !==
                            quartiersLocalStorageParsed.length
                    ) {
                        localStorage.setItem(
                            'quartiers',
                            JSON.stringify(quartiersServeurParsed)
                        );
                        console.log(
                            'Les quartiers en localStorage ont été remplacés par celles du serveur'
                        );
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            return quartiersLocalStorageParsed;
        }
        return [];
    }
    getMissions(): any[] {
        const missionsLocalStorage = localStorage.getItem('missions');
        if (missionsLocalStorage === null) {
            // Si les missions n'existent pas encore dans le local storage
            this.http.get<any[]>(`${this.API_URL}/missions`).subscribe(
                data => {
                    localStorage.setItem('missions', JSON.stringify(data));
                    console.log(
                        'Sauvegarde des missions dans le local storage'
                    );
                    return data;
                },
                error => {
                    console.error(error);
                    return [];
                }
            );
        } else {
            // Les missions existent dans le local storage
            console.log('Missions déjà chargés depuis le local storage');
            const missionsServeurPromise = this.http
                .get<any[]>(`${this.API_URL}/missions`)
                .toPromise();
            const missionsLocalStorageParsed = JSON.parse(missionsLocalStorage);
            missionsServeurPromise
                .then(missionsServeurParsed => {
                    if (
                        missionsServeurParsed &&
                        missionsServeurParsed.length !==
                            missionsLocalStorageParsed.length
                    ) {
                        localStorage.setItem(
                            'missions',
                            JSON.stringify(missionsServeurParsed)
                        );
                        console.log(
                            'Les missions en localStorage ont été remplacés par ceux du serveur'
                        );
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            return missionsLocalStorageParsed;
        }
        return [];
    }
}
