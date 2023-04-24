import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Habitation, Rue } from '../habitations.interface';

@Component({
    selector: 'app-details-habitation',
    templateUrl: './details-habitation.component.html',
    styleUrls: ['./details-habitation.component.css'],
})
export class DetailsHabitationComponent implements OnInit {
    habitation: Habitation = {
        _id: 0,
        adresse: {
            rue: {
                _id: '',
                nom: '',
                nomComplet: '',
                codePostal: '',
                ville: '',
            },
        },
        demandeur: { nom: '' },
        dates: { debut: new Date(), fin: new Date() },
        mesures: [],
        vehicule: '',
        googlemap: '',
    };

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id !== null) {
            this.habitation = {
                _id: parseInt(id),
                adresse: {
                    rue: {
                        _id: '1',
                        nom: 'Rue de la Paix',
                        nomComplet: 'Rue de la Paix',
                        codePostal: '75001',
                        ville: 'Paris',
                    },
                    numero: '12',
                },
                demandeur: {
                    nom: 'Jean Dupont',
                    tel: '01 23 45 67 89',
                },
                dates: {
                    debut: new Date('2023-04-23'),
                    fin: new Date('2023-04-30'),
                },
                mesures: ['Mesure 1', 'Mesure 2'],
                vehicule: 'Renault Clio',
                googlemap:
                    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.6016859431677!2d2.295367615699643!3d48.87484467928974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIzJzU1LjgiTiAywrA0MSczNi44Ilc!5e0!3m2!1sfr!2sfr!4v1619618471845!5m2!1sfr!2sfr',
            };
        }
    }
}
