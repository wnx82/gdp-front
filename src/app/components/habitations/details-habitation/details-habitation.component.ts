import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Habitation } from 'src/app/interfaces/Habitation.interface';
@Component({
    selector: 'app-details-habitation',
    templateUrl: './details-habitation.component.html',
    styleUrls: ['./details-habitation.component.css'],
})
export class DetailsHabitationComponent implements OnInit {
    id: any = '';
    habitation: Habitation | null = null;

    readonly API_URL = `${environment.apiUrl}/habitations`;
    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.getHabitation(this.id).subscribe(
                (data: Habitation) => {
                    this.habitation = data;
                    console.log(this.habitation); // Affichage dans la console log
                },
                error => {
                    console.log(error); // Affichage de l'erreur dans la console log
                }
            );
        });
    }

    getHabitation(id: string) {
        let url = `${this.API_URL}/${id}`;
        return this.http.get<Habitation>(url);
    }
}
