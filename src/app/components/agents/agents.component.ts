import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.css'],
})
export class AgentsComponent implements OnInit {
    private apiUrl: string | undefined;
    agents: any[] = [];
    filteredRues: any[] = [];
    selectedAgent: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    rues: any[] = [];
    constructor(private http: HttpClient) {}
    readonly API_URL = `${environment.apiUrl}/agents`;

    ngOnInit() {
        this.getAgents();
        this.http.get<any[]>('http://localhost:3003/rues').subscribe(
            data => {
                this.rues = data;
                console.log(this.rues);
            },
            error => {
                console.error(error);
            }
        );
    }

    getAgents() {
        let url = `${this.API_URL}`;
        this.http.get<any[]>(url).subscribe(
            data => {
                this.agents = data.filter(agent => !agent.deletedAt);
            },
            error => {
                console.log(error);
            }
        );
    }

    addAgent(agent: any) {
        this.http.post<any>(`${this.API_URL}`, agent).subscribe(
            data => {
                this.agents.push(data);
                this.isAdding = false;
            },
            error => {
                console.log(error);
            }
        );
    }

    editAgent(agent: any) {
        const url = `${this.API_URL}/${agent.id}`;

        this.http.patch<any>(url, agent).subscribe(
            data => {
                const index = this.agents.findIndex(a => a._id === data._id);
                this.agents[index] = data;
                this.selectedAgent = {};
                this.isEditing = false;
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteAgent(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.agents = this.agents.filter(a => a.id !== id);
                this.getAgents();
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteDeletedAgents() {
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe(
            () => {
                console.log(
                    'Les agents supprimés ont été supprimés définitivement.'
                );
                this.getAgents(); // Met à jour la liste des agents affichés
            },
            error => {
                console.log(error);
            }
        );
    }

    selectAgent(agent: any) {
        this.selectedAgent = { ...agent };
    }

    cancel() {
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedAgent = {};
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    filterRues(event: any) {
        let filteredRues = [];
        let query = event.query.toLowerCase();
        for (let i = 0; i < this.rues.length; i++) {
            let rue = this.rues[i];
            let fullName = `${rue.denomination} ${rue.nom}`.toLowerCase();
            if (fullName.indexOf(query) === 0) {
                filteredRues.push(fullName);
            }
        }
        this.filteredRues = filteredRues;
    }
}
