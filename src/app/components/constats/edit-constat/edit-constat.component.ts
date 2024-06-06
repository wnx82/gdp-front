import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
    FormArray,
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SelectItemGroup } from 'primeng/api';
import { Agent } from '../../../interfaces/User.interface';
import { Constat } from '../../../interfaces/Constat.interface';
import { Rue } from '../../../interfaces/Rue.interface.';
import { ConstatsComponent } from '../constats.component';
import { GetDataService } from '../../../services/getData/get-data.service';
@Component({
    selector: 'app-edit-constat',
    templateUrl: './edit-constat.component.html',
    styleUrls: ['./edit-constat.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class EditConstatComponent implements OnInit {
    private apiUrl: string | undefined;
    constats: Constat[] = [];
    @ViewChild('table') table: Table | undefined;
    dataForm: FormGroup;

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
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.selectedInfractions = []; // ou []

        this.dataForm = this.formBuilder.group({
            agents: ['', Validators.required],
            date: [new Date(), Validators.required],
            pv: [false, Validators.required],
            vehicule: this.formBuilder.group({
                marque: [''],
                modele: [''],
                couleur: [''],
                type: [''],
                immatriculation: [''],
            }),
            personne: this.formBuilder.group({
                firstname: [''],
                lastname: [''],
                birthday: [''],
                nationalNumber: [''],
                tel: [''],
                adresse: this.formBuilder.group({
                    rue: [''],
                    cp: [''],
                    localite: [''],
                }),
            }),
            adresse: this.formBuilder.group({
                rue: [''],
                numero: [''],
            }),
            infractions: [''],
            notes: [''],
            annexes: [''],
        });
    }

    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/constats`;
    statuses: any[] = [];
    rues$ = this.getDataService.rues$;
    agents$ = this.getDataService.agents$;
    infractions$ = this.getDataService.infractions$;
    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        console.log('ID de la route :', id);
        this.getConstatById(id);

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
    getConstatById(id: string) {
        const url = `${this.API_URL}/${id}`;
        this.http.get<Constat>(url).subscribe({
            next: constat => {
                console.log('Constat récupéré :', constat);

                const date = constat?.date ? new Date(constat.date) : null;
                this.dataForm.patchValue({
                    constat: id,
                    agents: constat.agents,
                    date: date,
                    pv: constat.pv,
                    vehicule: {
                        marque: constat.vehicule?.marque || null,
                        modele: constat.vehicule?.modele || null,
                        couleur: constat.vehicule?.couleur || null,
                        type: constat.vehicule?.type || null,
                        immatriculation:
                            constat.vehicule?.immatriculation || null,
                    },
                    personne: {
                        firstname: constat.personne?.firstname || null,
                        lastname: constat.personne?.lastname || null,
                        birthday: constat.personne?.birthday || null,
                        nationalNumber:
                            constat.personne?.nationalNumber || null,
                        tel: constat.personne?.tel || null,
                        adresse: {
                            rue: constat.personne?.adresse?.rue || null,
                            cp: constat.personne?.adresse?.cp || null,
                            localite:
                                constat.personne?.adresse?.localite || null,
                        },
                    },
                    adresse: {
                        rue: constat.adresse?.rue || null,
                        numero: constat.adresse?.numero || null,
                    },
                    infractions: constat.infractions,
                    notes: constat.notes,
                    annexes: constat.annexes,
                });
            },
            error: error => {
                console.log(
                    'Erreur lors de la récupération du constat :',
                    error
                );
            },
        });
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

    edit(donnee: Constat) {
        const id = this.route.snapshot.params['id'];
        if (!donnee) {
            console.error('Données invalides', donnee);
            return;
        }
        const url = `${this.API_URL}/${id}`;

        this.http.patch<Constat>(url, this.dataForm.value).subscribe({
            next: data => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.cancel();
            },
            error: error => {
                console.error('Erreur de requête PATCH', error);
                if (error.error && error.error.message) {
                    console.error(
                        "Message d'erreur du serveur :",
                        error.error.message
                    );
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'La modification a échouée',
                });
            },
        });
    }

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
