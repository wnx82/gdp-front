import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
@Component({
    selector: 'app-rues',
    templateUrl: './rues.component.html',
    styleUrls: ['./rues.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class RuesComponent implements OnInit {
    private apiUrl: string | undefined;
    rues: any[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    currentPage: number = 1;
    itemsPerPage: number = 50;
    localite: string = '';
    cp: string = '';
    nom: string = '';
    quartier: string = '';
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    dataForm = new FormGroup({
        nom: new FormControl(''),
        denomination: new FormControl(''),
        nomComplet: new FormControl(''),
        quartier: new FormControl(''),
        cp: new FormControl(''),
        localite: new FormControl(''),
        codeRue: new FormControl(''),
        traductionNl: new FormControl(''),
        xMin: new FormControl(''),
        xMax: new FormControl(''),
        yMin: new FormControl(''),
        yMax: new FormControl(''),
        idTronconCentral: new FormControl(''),

    });
    constructor(private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    readonly API_URL = `${environment.apiUrl}/rues`;

    ngOnInit(): void {
        this.get();
    }
    private handleError(error: any): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }
    onPageChange(event: { page: number }) {
        this.currentPage = event.page + 1;
        this.get();
    }

    get() {
        let url = `${this.API_URL}/?page=${this.currentPage}&pageSize=${this.itemsPerPage}`;

        if (this.localite) {
            url += `&localite=${this.localite}`;
        }

        if (this.cp) {
            url += `&cp=${this.cp}`;
        }

        if (this.nom) {
            url += `&nom=${this.nom}`;
        }

        if (this.quartier) {
            url += `&quartier=${this.quartier}`;
        }

        // this.http.get<any[]>(url).subscribe(
        //     data => {
        //         this.rues = data;
        //     },
        //     error => {
        //         console.log(error);
        //     }
        // );
        this.http.get<any[]>(url).subscribe(
            data => {
                this.rues = data.filter(rue => !rue.deletedAt);
            },
            error => {
                console.log(error);
            }
        );
    }
    addRue(rue: any) {
        this.http.post<any>(`${this.API_URL}`, rue).subscribe(
            data => {
                this.rues.push(data);
                this.isAdding = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rue ajoutée' });
                this.dataForm.reset();
                this.get();
            },
            error => {
                console.log(error);
            }
        );
    }

    editRue(id: number, rue: any) {
        console.log(rue)
        if (!rue) {
            console.error('Données invalides', rue);
            return;
        }

        const url = `${this.API_URL}/${id}`;
        this.http.patch<any>(url, rue).subscribe(
            data => {
                const index = this.rues.findIndex(
                    r => r._id === data._id
                );
                this.rues[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
                this.dataForm.reset();
                this.get();
            },
            error => {
                console.log(error);
                if (error.error && error.error.message) {
                    console.error('Message d\'erreur du serveur :', error.error.message);
                }
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'La modification a échoué' });
            }
        );
    }
    onConfirmDelete(mission: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cette mission ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRue(mission._id);
            }
        });
    }
    deleteRue(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe(
            () => {
                this.rues = this.rues.filter(r => r.id !== id);
                this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Rue effacée' });
                this.get();
            },
            error => {
                console.log(error);
            }
        );
    }
    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
        //
    }

    confirmDeleteDeleted(): void {
        // Mettez ici le code pour supprimer définitivement les données supprimées
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe(
            () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complétement effacées' });
                this.get(); // Met à jour la liste
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
            }
        );
        this.displayConfirmationDialog = false;
    }

    selectData(donnee: any) {
        this.selectedData = { ...donnee };
    }


    cancel() {
        this.selectedData = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedData = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        console.log(this.selectedData)

    }

    search() {
        this.currentPage = 1;
        this.get();
    }
}
