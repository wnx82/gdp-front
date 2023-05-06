import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MessageService } from 'primeng/api';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SelectItemGroup } from 'primeng/api';
import { Agent } from 'src/app/interfaces/Agent.interface';
import { Constat } from 'src/app/interfaces/Constat.interface';
import { Rue } from 'src/app/interfaces/Rue.interface.';
import { ConstatsComponent } from '../constats.component';
import { GetDataService } from 'src/app/services/getData/get-data.service';
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
        pv: new FormControl('', [Validators.required]),
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

        infractions: new FormArray([]),
        notes: new FormControl(''),
        annexes: new FormArray([]),
    });
    checked: boolean = false;
    groupedAgents: SelectItemGroup[] = [];
    selectedAgents: Agent[] = [];
    agentsBrut: any[] = [];
    agents: any[] = [];
    agentsNeed: any[] = [];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private getDataService: GetDataService
    ) {}
    storedValue: any;
    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/constats`;
    statuses: any[] = [];
    rues$ = this.getDataService.rues$;
    agents$ = this.getDataService.agents$;
    ngOnInit() {
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

    cancel() {
        // this.selectedConstat = {};
        // this.isAdding = false;
        // this.isEditing = false;
    }

    clear(table: Table) {
        table.clear();
    }
}
