import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class RuesLocalStorageService {
    constructor(private http: HttpClient) {}

    getRues(): any[] {
        const ruesLocalStorage = localStorage.getItem('rues');
        if (ruesLocalStorage === null) {
            // Si les rues n'existent pas encore dans le local storage
            this.http.get<any[]>('http://localhost:3003/rues').subscribe(
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
            return JSON.parse(ruesLocalStorage);
        }
        return [];
    }
}
