import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService, SelectItem } from 'primeng/api';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-rues',
    templateUrl: './rues.component.html',
    styleUrls: ['./rues.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class RuesComponent implements OnInit {
    private apiUrl: string | undefined;
    rues: any[] = [];
    quartiers: any[] = [];
    localiteList = [
        { label: 'Mouscron', value: 'Mouscron', cp: '7700' },
        { label: 'Luingne', value: 'Luingne', cp: '7700' },
        { label: 'Herseaux', value: 'Herseaux', cp: '7712' },
        { label: 'Dottignies', value: 'Dottignies', cp: '7711' },
    ];
    cpList = [
        { label: '7700', value: '7700', name: 'Mouscron' || 'Luingne' },

        { label: '7712', value: '7712', name: 'Herseaux' },
        { label: '7711', value: '7711', name: 'Dottignies' },
    ];

    localiteToCodePostal: { [key: string]: string } = {
        Mouscron: '7700',
        Luingne: '7700',
        Herseaux: '7712',
        Dottignies: '7711',
    };

    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;

    itemsPerPage: number = 25;

    displayConfirmationDelete = false;
    displayConfirmationDialog = false;
    nom: string = '';
    denomination: string = '';
    nomComplet: string = '';

    dataForm = new FormGroup({
        nom: new FormControl({ value: '', disabled: false }),
        denomination: new FormControl(''),

        nomComplet: new FormControl(
            { value: '', disabled: false },
            Validators.required
        ),
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
    formulaire: FormGroup | undefined;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) {}

    storedValue: any;

    readonly API_URL = `${environment.apiUrl}/rues`;

    ngOnInit(): void {
        this.get();
        this.loadQuartiers();
        this.dataForm.get('localite')?.valueChanges.subscribe(value => {
            const codePostal = this.localiteList.find(
                option => option.value === value
            )?.cp;
            this.dataForm.get('cp')?.setValue(codePostal ?? null);
        });

        this.dataForm.get('cp')?.valueChanges.subscribe(value => {
            const localite = this.cpList.find(
                option => option.value === value
            )?.name;
            this.dataForm.get('localite')?.setValue(localite ?? null);
        });
    }

    private loadQuartiers(): void {
        const quartiersLocalStorage = localStorage.getItem('quartiers');
        if (quartiersLocalStorage === null) {
            // Si les quartiers n'existent pas encore dans le local storage
            this.http.get<any[]>('http://localhost:3003/quartiers').subscribe(
                data => {
                    this.quartiers = data;
                    localStorage.setItem(
                        'quartiers',
                        JSON.stringify(this.quartiers)
                    );
                    console.log(
                        'Sauvegarde des quartiers dans le local storage'
                    );
                },
                error => {
                    console.error(error);
                }
            );
        } else {
            // Les quartiers existent dans le local storage
            this.quartiers = JSON.parse(quartiersLocalStorage);
            console.log('Quartiers déjà chargés depuis le local storage');
        }
    }
    get() {
        this.http.get<any[]>(`${this.API_URL}`).subscribe({
            next: data => {
                this.rues = data.filter(rue => !rue.deletedAt);
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

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    addRue(rue: any) {
        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
            next: data => {
                this.rues.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Rue ajoutée',
                });
                this.dataForm.reset();
                this.get();
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

    editRue(id: number, rue: any) {
        console.log(rue);
        if (!rue) {
            console.error('Données invalides', rue);
            return;
        }
        // Vérifier chaque champ de la rue et utiliser la valeur actuelle si le champ n'a pas été modifié
        const updatedRue = {
            nom: rue.nom !== null ? rue.nom : this.selectedData.nom,
            denomination:
                rue.denomination !== null
                    ? rue.denomination
                    : this.selectedData.denomination,
            nomComplet:
                rue.nomComplet !== null
                    ? rue.nomComplet
                    : this.selectedData.nomComplet,
            cp: rue.cp !== null ? rue.cp : this.selectedData.cp,
            localite:
                rue.localite !== null
                    ? rue.localite
                    : this.selectedData.localite,
            quartier:
                rue.quartier !== null
                    ? rue.quartier
                    : this.selectedData.quartier,
            codeRue:
                rue.codeRue !== null ? rue.codeRue : this.selectedData.codeRue,
            traductionNl:
                rue.traductionNl !== null
                    ? rue.traductionNl
                    : this.selectedData.traductionNl,
            // Ajouter les autres champs de la rue ici si nécessaire
        };
        const url = `${this.API_URL}/${id}`;
        this.http.patch<any>(url, this.dataForm.value).subscribe({
            next: data => {
                const index = this.rues.findIndex(r => r._id === data._id);
                this.rues[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.get();
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
    onConfirmDelete(mission: any) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cette mission ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRue(mission._id);
            },
        });
    }
    deleteRue(id: number) {
        this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.rues = this.rues.filter(r => r.id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Rue effacée',
                });
                this.get();
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
                this.get(); // Met à jour la liste
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
                this.get(); // Met à jour la liste
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

    selectData(donnee: any) {
        this.selectedData = { ...donnee };
        this.dataForm.patchValue({
            nom: donnee?.nom,
            denomination: donnee?.denomination,
            nomComplet: donnee?.nomComplet,
            quartier: donnee?.quartier,
            cp: donnee?.cp,
            localite: donnee?.localite,
            codeRue: donnee?.codeRue,
            traductionNl: donnee?.traductionNl,
            xMin: donnee?.xMin,
            xMax: donnee?.xMax,
            yMin: donnee?.yMin,
            yMax: donnee?.yMax,
            idTronconCentral: donnee?.idTronconCentral,
        });
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
        console.log(this.selectedData);
    }

    search() {
        this.get();
    }
    clear(table: Table) {
        table.clear();
    }
}
