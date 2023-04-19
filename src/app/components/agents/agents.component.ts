import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class AgentsComponent implements OnInit {
    private apiUrl: string | undefined;
    agents: any[] = [];
    filteredRues: any[] = [];
    selectedAgent: any = {
        birthday: new Date(),
    };
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
        userAccess: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d+$/),
        ]),
        matricule: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d+$/),
        ]),
        firstname: new FormControl(''),
        lastname: new FormControl(''),
        birthday: new FormControl(''),
        tel: new FormControl(''),
        iceContact: new FormControl(''),
        adresse: new FormGroup({
            rue: new FormControl(''),
            numero: new FormControl(''),
        }),
        picture: new FormControl(''),
        formations: new FormControl(''),
    });

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService
    ) {}
    storedValue: any;
    rues: any[] = [];
    readonly API_URL = `${environment.apiUrl}/agents`;
    date!: Date;

    ngOnInit() {
        this.getAgents();

        this.loadRues();
    }
    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }
    private loadRues(): void {
        const ruesLocalStorage = localStorage.getItem('rues');
        if (ruesLocalStorage === null) {
            // Si les rues n'existent pas encore dans le local storage
            this.http.get<any[]>('http://localhost:3003/rues').subscribe(
                data => {
                    this.rues = data;
                    localStorage.setItem('rues', JSON.stringify(this.rues));
                    console.log('Sauvegarde des rues dans le local storage');
                },
                error => {
                    console.error(error);
                }
            );
        } else {
            // Les rues existent dans le local storage
            this.rues = JSON.parse(ruesLocalStorage);
            console.log('Rues déjà chargées depuis le local storage');
        }
    }
    getAgents() {
        let url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe({
            next: data => {
                this.agents = data.filter(agent => !agent.deletedAt);
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

    addAgent(agent: any) {
        let url = `${this.API_URL}/agents`;
        this.http.post<any>(url, agent).subscribe({
            next: data => {
                this.agents.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agent ajouté',
                });
                this.dataForm.reset();
                this.getAgents();
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

    editAgent(id: number, agent: any) {
        if (!agent) {
            console.error('Données invalides', agent);
            return;
        }

        const updatedAgent = {
            email:
                agent.email !== null ? agent.email : this.selectedAgent.email,
            password:
                agent.password !== null
                    ? agent.password
                    : this.selectedAgent.password,
            userAccess:
                agent.userAccess !== null
                    ? agent.userAccess
                    : this.selectedAgent.userAccess,
            matricule:
                agent.matricule !== null
                    ? agent.matricule
                    : this.selectedAgent.matricule,
            firstname:
                agent.firstname !== null
                    ? agent.firstname
                    : this.selectedAgent.firstname,
            lastname:
                agent.lastname !== null
                    ? agent.lastname
                    : this.selectedAgent.lastname,
            birthday:
                agent.birthday !== null
                    ? agent.birthday
                    : this.selectedAgent.birthday,
            tel: agent.tel !== null ? agent.tel : this.selectedAgent.tel,
            iceContact:
                agent.iceContact !== null
                    ? agent.iceContact
                    : this.selectedAgent.iceContact,
            adresse:
                agent.adresse !== null
                    ? agent.adresse
                    : this.selectedAgent.adresse,
            picture:
                agent.picture !== null
                    ? agent.picture
                    : this.selectedAgent.picture,
            formations:
                agent.formations !== null
                    ? agent.formations
                    : this.selectedAgent.formations,
            // Ajouter les autres champs de l'agent ici si nécessaire
        };

        const url = `${this.API_URL}/agents/${this.selectedAgent._id}`;

        this.http.patch<any>(url, updatedAgent).subscribe({
            next: data => {
                const index = this.agents.findIndex(a => a._id === data._id);
                this.agents[index] = data;
                this.selectedAgent = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getAgents();
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

    onConfirmDelete(agent: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet agent ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteAgent(agent._id);
            },
        });
    }

    deleteAgent(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.agents = this.agents.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Agent effacé',
                });
                this.getAgents();
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

    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
        //
    }
    confirmDeleteDeleted(): void {
        // Mettez ici le code pour supprimer définitivement les données supprimées
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
                });
                this.getAgents(); // Met à jour la liste
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });

        this.displayConfirmationDialog = false;
    }
    confirmRestoreDeleted(): void {
        // Mettez ici le code pour restaurer les données supprimées
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
                });
                this.getAgents(); // Met à jour la liste
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
    selectAgent(agent: any) {
        this.selectedAgent = { ...agent };
    }

    cancel() {
        this.selectedAgent = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedAgent = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        console.log(this.selectedAgent);
    }

    filterRues(event: any) {
        const query = event.query.toLowerCase();
        this.filteredRues = this.rues
            .filter(
                rue =>
                    typeof rue.nomComplet === 'string' &&
                    rue.nomComplet.toLowerCase().includes(query)
            )

            .sort((a, b) => {
                const aIndex = a.nomComplet.toLowerCase().indexOf(query);
                const bIndex = b.nomComplet.toLowerCase().indexOf(query);
                if (aIndex < bIndex) {
                    return -1;
                }
                if (aIndex > bIndex) {
                    return 1;
                }
                // Si les deux rues ont la même position de la requête,
                // on les trie par ordre alphabétique
                return a.nomComplet.localeCompare(b.nomComplet);
            })

            .slice(0, 10)
            .map(rue => rue.nomComplet);
    }
}
