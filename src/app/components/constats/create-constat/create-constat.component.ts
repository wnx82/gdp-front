import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SelectItemGroup } from 'primeng/api';
import { Agent } from '../../../interfaces/Agent.interface';
import { Constat } from '../../../interfaces/Constat.interface';
import { Rue } from '../../../interfaces/Rue.interface.';
import { ConstatsComponent } from '../constats.component';
import { GetDataService } from '../../../services/getData/get-data.service';
@Component({
    selector: 'app-create-constat',
    templateUrl: './create-constat.component.html',
    styleUrls: ['./create-constat.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateConstatComponent implements OnInit {
    private apiUrl: string | undefined;
    constats: Constat[] = [];

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

        // infractions: new FormArray([]),
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
        //Récupération des agents
        // this.getConstats();
        //Récupération des rues

        this.rues$.subscribe(
            rues => {
                this.rues = rues;
                // console.log(this.rues);
            },
            error => {
                console.error(error);
            }
        );
        this.infractions$.subscribe(
            infractions => {
                this.infractions = infractions;
                // console.log(this.infractions);
                this.categories = this.infractions.map(
                    infraction => infraction.category
                );
                // Tri des catégories par ordre croissant de priorité
                this.categories = this.infractions
                    .sort((a, b) => a.priority - b.priority)
                    .map(infraction => infraction.category);

                // console.log(this.categories);

                this.selectedCategory = this.infractions.map(infraction => {
                    return {
                        label: infraction.category,
                        value: infraction.list
                            .map((item: string[]) => item[1])
                            .join(', '),
                    };
                });
                // Appeler onCategoryChange() avec "Arrêt et stationnement"
                this.onCategoryChange('Arrêt et stationnement');
                // console.log(this.selectedCategory);

                // // Formatage des données pour le multiselect des infractions
                // const infractionsList = this.infractions.reduce(
                //     (list, infraction) => {
                //         return list.concat(
                //             infraction.list.map((item: string[]) => {
                //                 return {
                //                     label: item[1],
                //                     value: item[0],
                //                 };
                //             })
                //         );
                //     },
                //     []
                // );

                // console.log(infractionsList);
            },
            error => {
                console.error(error);
            }
        );

        //Récupérations des agents
        this.agents$.subscribe(agents => {
            this.agents = agents.map(agent => ({
                value: agent._id,
                label: agent.matricule,
            }));
            // console.log(this.agents);
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
    // onCategoryChange() {
    //     this.selectedInfractions = [];
    // }
    onCategoryChange(category: string) {
        this.selectedCategory = category;
        // this.selectedCategory = 'Arrêt et stationnement' ?? category;
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
            this.selectedInfractions = []; // Aucune infraction sélectionnée si la catégorie n'est pas trouvée
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
                // this.dataForm.reset();
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
        // this.selectedConstat = {};
        // this.isAdding = false;
        // this.isEditing = false;
        this.dataForm.reset();
        this.router.navigate(['constats']);
    }

    clear(table: Table) {
        table.clear();
    }
    resetForm() {
        // Récupère la référence du formulaire
        const form = this.dataForm;

        // Réinitialise les valeurs du formulaire à leur valeur par défaut
        form.reset();

        // Marque tous les contrôles du formulaire comme "non modifiés"
        form.markAsPristine();

        // Marque tous les contrôles du formulaire comme "non touchés"
        form.markAsUntouched();
    }
    fillWithCurrentDate() {
        this.currentDate = new Date();
        this.dataForm.patchValue({
            date: this.currentDate,
        });
    }
}
