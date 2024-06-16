import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MessageService,
    ConfirmationService,
    SelectItemGroup,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Agent } from '../../../../interfaces/User.interface';
import { Constat } from '../../../../interfaces/Constat.interface';
import { Rue } from '../../../../interfaces/Rue.interface';
import { ConstatsComponent } from '../constats.component';
import { GetDataService } from '../../../../services/getData/get-data.service';

@Component({
    selector: 'app-create-constat',
    templateUrl: './create-constat.component.html',
    styleUrls: ['./create-constat.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateConstatComponent implements OnInit {
    private apiUrl: string | undefined;
    constats: Constat[] = [];
    location: string | null = null;

    @ViewChild('table') table: Table | undefined;

    dataForm = new FormGroup({
        agents: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
        pv: new FormControl(false, [Validators.required]),
        vehicule: new FormGroup({
            marque: new FormControl(''),
            modele: new FormControl(''),
            couleur: new FormControl(''),
            type: new FormControl(''),
            immatriculation: new FormControl(''),
        }),
        personne: new FormGroup({
            firstname: new FormControl(''),
            lastname: new FormControl(''),
            birthday: new FormControl(''),
            nationalNumber: new FormControl(''),
            tel: new FormControl(''),
            adresse: new FormGroup({
                rue: new FormControl(''),
                cp: new FormControl(''),
                localite: new FormControl(''),
            }),
        }),
        adresse: new FormGroup({
            rue: new FormControl(''),
            numero: new FormControl(''),
        }),
        infractions: new FormControl(''),
        notes: new FormControl(''),
        annexes: new FormControl(''),
    });
    checked: boolean = false;
    groupedAgents: SelectItemGroup[] = [];
    selectedAgents: Agent[] = [];
    agentsBrut: any[] = [];
    agents: any[] = [];
    infractions: any[] = [];
    agentsNeed: any[] = [];
    currentDate: any = Date;
    categories: any[] = [];
    selectedCategory: any;
    selectedInfractions: any[] = [];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private getDataService: GetDataService,
        private router: Router
    ) {
        this.selectedInfractions = []; // ou []
    }

    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/constats`;
    statuses: any[] = [];
    rues$ = this.getDataService.rues$;
    agents$ = this.getDataService.agents$;
    infractions$ = this.getDataService.infractions$;

    ngOnInit() {
        this.dataForm.patchValue({ pv: false });

        this.rues$.subscribe(
            rues => {
                this.rues = rues;
                console.log(rues);
            },
            error => {
                console.error(error);
            }
        );
        this.infractions$.subscribe(
            infractions => {
                this.infractions = infractions;
                this.categories = this.infractions.map(
                    infraction => infraction.category
                );
                this.categories = this.infractions
                    .sort((a, b) => a.priority - b.priority)
                    .map(infraction => infraction.category);
                this.selectedCategory = this.infractions.map(infraction => {
                    return {
                        label: infraction.category,
                        value: infraction.list
                            .map((item: string[]) => item[1])
                            .join(', '),
                    };
                });
                this.onCategoryChange('Arrêt et stationnement');
            },
            error => {
                console.error(error);
            }
        );

        this.agents$.subscribe(agents => {
            this.agents = agents.map(agent => ({
                value: agent._id,
                label: agent.matricule,
            }));
        });

        this.statuses = [
            { label: 'Avertissement', value: false },
            { label: 'PV', value: true },
        ];
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    onCategoryChange(category: string) {
        this.selectedCategory = category;
        const infractions = this.infractions.find(
            infraction => infraction.category === this.selectedCategory
        );
        if (infractions) {
            this.selectedInfractions = infractions.list.map(
                (item: string[]) => {
                    return { label: item[1], value: item[1] };
                }
            );
        } else {
            this.selectedInfractions = [];
        }
    }

    addConstat(constat: any) {
        console.log(this.dataForm.value);
        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
            next: data => {
                this.constats.push(data);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Constat ajouté',
                });
                this.dataForm.controls['date'].reset();
                this.dataForm.controls['annexes'].reset();
                this.dataForm.controls['infractions'].reset();
                this.dataForm.controls['notes'].reset();
                this.dataForm.controls['vehicule'].reset();
                this.dataForm.controls['personne'].reset();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    getCurrentDate(): Date {
        return new Date();
    }

    cancel() {
        this.dataForm.reset();
        this.router.navigate(['constats']);
    }

    clear(table: Table) {
        table.clear();
    }

    resetForm() {
        const form = this.dataForm;
        form.reset();
        form.markAsPristine();
        form.markAsUntouched();
    }

    fillWithCurrentDate() {
        this.currentDate = new Date();
        this.dataForm.patchValue({
            date: this.currentDate,
        });
    }

    getGeolocation() {
        // console.log(`${environment.apiGoogleMapKey}`);
        const adresseFormGroup = this.dataForm.get('adresse') as FormGroup;
        adresseFormGroup.patchValue({
            rue: '',
            numero: '',
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                this.http
                    .get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&key=${environment.apiGoogleMapKey}`
                    )
                    .subscribe((data: any) => {
                        this.location = data.display_name;
                        // console.log(this.location);

                        if (this.location) {
                            const locationArray = this.location
                                .split(',')
                                .map(item => item.trim());
                            let locationJson: any = {
                                numero: '',
                                nomComplet: '',
                                ville: '',
                                arrondissement: '',
                                province: '',
                                region: '',
                                codePostal: '',
                                pays: '',
                            };

                            if (locationArray.length >= 2) {
                                if (locationArray.length >= 8) {
                                    locationJson = {
                                        numero: locationArray[0],
                                        nomComplet: locationArray[1],
                                        ville: locationArray[2],
                                        arrondissement: locationArray[3],
                                        province: locationArray[4],
                                        region: locationArray[5],
                                        codePostal: locationArray[6],
                                        pays: locationArray[7],
                                    };
                                } else {
                                    locationJson = {
                                        nomComplet: locationArray[0],
                                        ville: locationArray[1],
                                        arrondissement: locationArray[2],
                                        province: locationArray[3],
                                        region: locationArray[4],
                                        codePostal: locationArray[5],
                                        pays: locationArray[6],
                                    };
                                }

                                console.log(locationJson);
                                this.findAndSelectRue(locationJson);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Succès',
                                    detail: `Localisation trouvée: ${locationJson.nomComplet}`,
                                });
                            } else {
                                console.error(
                                    'Adresse inattendue, moins de 2 parties:',
                                    locationArray
                                );
                            }
                        } else {
                            console.error('Adresse non définie.');
                        }
                    });
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "La géolocalisation n'est pas supportée par ce navigateur.",
            });
        }
    }

    findAndSelectRue(locationJson: any) {
        if (!this.rues || this.rues.length === 0) {
            console.error('La liste des rues est vide ou non définie.');
            return;
        }

        // Vérifier que locationJson et nomComplet sont définis
        if (!locationJson || !locationJson.nomComplet) {
            console.error('locationJson ou nomComplet non défini.');
            return;
        }

        const normalizedNomComplet = locationJson.nomComplet
            .trim()
            .toLowerCase();
        const matchingRue = this.rues.find(rue => {
            const normalizedRueName = rue.nomComplet.trim().toLowerCase();
            return normalizedNomComplet.includes(normalizedRueName);
        });

        if (matchingRue) {
            const adresseFormGroup = this.dataForm.get('adresse') as FormGroup;
            adresseFormGroup.patchValue({
                rue: matchingRue._id,
                numero: locationJson.numero || '', // Ajoute le numéro si présent, sinon chaîne vide
            });
        } else {
            console.warn(
                `Aucune rue trouvée pour le nom complet: ${locationJson.nomComplet}`
            );
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Aucune rue trouvée dans la liste pour la localisation: ${locationJson.nomComplet}`,
            });
        }
    }

    //   findAndSelectRue() {
    //     const matchingRue = this.rues.find(rue => this.location?.includes(rue.nomComplet));
    //     if (matchingRue) {
    //       this.dataForm.patchValue({
    //         adresse: { rue: matchingRue._id }
    //       });
    //     }
    //   }
}
