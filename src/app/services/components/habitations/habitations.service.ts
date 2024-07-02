import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Habitation } from '../../../interfaces/Habitation.interface';
import { Rue } from '../../../interfaces/Rue.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HabitationsService {
    private readonly API_URL = `${environment.apiUrl}/habitations`;

    constructor(private http: HttpClient) {}

    getHabitations(active: boolean = false): Observable<Habitation[]> {
        let url = `${this.API_URL}`;
        if (active) {
            url += '/active';
        }
        return this.http.get<Habitation[]>(url);
    }

    getRues(): Observable<Rue[]> {
        return this.http.get<Rue[]>(`${environment.apiUrl}/rues`);
    }

    addHabitation(habitation: any): Observable<Habitation> {
        return this.http.post<Habitation>(this.API_URL, habitation);
    }

    editHabitation(id: number, habitation: any): Observable<Habitation> {
        const url = `${this.API_URL}/${id}`;
        return this.http.patch<Habitation>(url, habitation);
    }

    deleteHabitation(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/${id}`);
    }

    purgeHabitations(): Observable<any> {
        const url = `${this.API_URL}/purge`;
        return this.http.post(url, {});
    }

    restoreHabitations(): Observable<any> {
        const url = `${this.API_URL}/restore`;
        return this.http.post(url, {});
    }
}
