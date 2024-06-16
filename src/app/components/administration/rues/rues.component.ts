import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessageService, SelectItem } from 'primeng/api';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { Rue } from '../../../interfaces/Rue.interface';
import { GetDataService } from '../../../services/getData/get-data.service';
@Component({
    selector: 'app-rues',
    templateUrl: './rues.component.html',
    styleUrls: ['./rues.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class RuesComponent implements OnInit {
    private apiUrl: string | undefined;
    rues: Rue[] = [];
    quartiers: any[] = [];

    localiteList = [
        { label: 'Mouscron', value: 'Mouscron', cp: '7700' },
        { label: 'Luingne', value: 'Luingne', cp: '7700' },
        { label: 'Herseaux', value: 'Herseaux', cp: '7712' },
        { label: 'Dottignies', value: 'Dottignies', cp: '7711' },
    ];
    cpList = [
        { label: '7700', value: '7700', name: 'Mouscron' },
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
        private _localStorageService: LocalStorageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private getDataService: GetDataService
    ) {}

    storedValue: any;

    readonly API_URL = `${environment.apiUrl}/rues`;
    quartiers$ = this.getDataService.quartiers$;
    ngOnInit(): void {
        this.get();
        // this.loadQuartiers();
        // this.quartiers = this._localStorageService.getQuartiers();
        this.quartiers$.subscribe(
            quartiers => {
                this.quartiers = quartiers;
            },
            error => {
                console.error(error);
            }
        );

        this.dataForm.get('cp')?.valueChanges.subscribe(value => {
            const localite = this.cpList.find(
                option => option.value === value
            )?.name;
            if (localite) {
                this.dataForm
                    .get('localite')
                    ?.setValue(localite, { emitEvent: false });
            }
        });

        this.dataForm.get('localite')?.valueChanges.subscribe(value => {
            const codePostal = this.localiteList.find(
                option => option.value === value
            )?.cp;
            if (codePostal) {
                this.dataForm
                    .get('cp')
                    ?.setValue(codePostal, { emitEvent: false });
            }
        });
    }

    get() {
        this.http.get<Rue[]>(`${this.API_URL}`).subscribe({
            next: data => {
                this.rues = data.filter(rue => !rue.deletedAt);
                // console.log(this.rues);
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
    getSeverityLoc(
        localite: string
    ):
        | 'success'
        | 'secondary'
        | 'info'
        | 'warning'
        | 'danger'
        | 'contrast'
        | undefined {
        switch (localite) {
            case 'Dottignies':
                return 'warning';
            case 'Luingne':
                return 'danger';
            case 'Herseaux':
                return 'info';
            case 'Mouscron':
                return 'success';
            default:
                return 'success'; // Vous pouvez également retourner 'secondary' ou 'contrast' selon vos besoins
        }
    }
    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    addRue(rue: any) {
        this.http.post<Rue>(`${this.API_URL}`, this.dataForm.value).subscribe({
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
        this.http.patch<Rue>(url, this.dataForm.value).subscribe({
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

    deleteRue(_id: number) {
        this.http.delete<any>(`${this.API_URL}/${_id}`).subscribe({
            next: () => {
                this.rues = this.rues.filter(r => r._id !== _id);
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

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
    }
}
