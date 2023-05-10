import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SelectItemGroup } from 'primeng/api';
import { Agent } from 'src/app/interfaces/Agent.interface';

import { GetDataService } from 'src/app/services/getData/get-data.service';
import { Dailies } from 'src/app/interfaces/Dailies.interface';
import { Vehicule } from 'src/app/interfaces/Vehicule.interface';

@Component({
    selector: 'app-create-dailies',
    templateUrl: './create-dailies.component.html',
    styleUrls: ['./create-dailies.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateDailiesComponent implements OnInit {
    private apiUrl: string | undefined;
    dailies: Dailies[] = [];

    @ViewChild('table') table: Table | undefined;

    dataForm = new FormGroup({
        agents: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
        horaire: new FormControl(''),
        vehicule: new FormControl(''),
        quartiers: new FormControl(''),
        missions: new FormControl(''),
        notes: new FormControl(''),
    });
    checked: boolean = false;
    groupedAgents: SelectItemGroup[] = [];
    selectedAgents: Agent[] = [];
    agentsBrut: any[] = [];
    agents: any[] = [];
    horaires: any[] = [];
    quartiers: any[] = [];
    missions: any[] = [];
    vehicules: any[] = [];

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

    readonly API_URL = `${environment.apiUrl}/dailies`;
    statuses: any[] = [];
    agents$ = this.getDataService.agents$;
    horaires$ = this.getDataService.horaires$;
    quartiers$ = this.getDataService.quartiers$;
    missions$ = this.getDataService.missions$;
    vehicules$ = this.getDataService.vehicules$;

    ngOnInit() {
        //Récupérations des agents
        this.agents$.subscribe(agents => {
            this.agents = agents.map(agent => ({
                value: agent._id,
                label: agent.matricule,
            }));
            // console.log(this.agents);
        });
        this.horaires$.subscribe(
            horaires => {
                this.horaires = horaires.map(horaire => horaire.horaire);
            },
            error => {
                console.error(error);
            }
        );

        this.quartiers$.subscribe(quartiers => {
            this.quartiers = quartiers.map(quartier => ({
                value: quartier._id,
                label: quartier.title,
            }));
            // console.log(this.agents);
        });
        this.missions$.subscribe(missions => {
            this.missions = missions.map(mission => ({
                value: mission._id,
                label: mission.title,
            }));
            // console.log(this.agents);
        });
        this.vehicules$.subscribe(
            vehicules => {
                this.vehicules = vehicules.map(vehicule => vehicule.marque);
            },
            error => {
                console.error(error);
            }
        );

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

    addDailie(dailies: any) {
        console.log(this.dataForm.value);
        this.dataForm.controls['vehicule'].getRawValue()?.toString();
        this.dataForm.controls['horaire'].getRawValue()?.toString();

        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
            next: data => {
                this.dailies.push(data);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Dailie ajouté',
                });
                // this.dataForm.controls['date'].reset();
                this.dataForm.reset();

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
        // this.selectedDailie = {};
        // this.isAdding = false;
        // this.isEditing = false;
        this.dataForm.reset();
        this.router.navigate(['dailies']);
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
