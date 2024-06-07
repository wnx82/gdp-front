import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalStorageService } from '../../../services/localstorage/local-storage.service';
import { User } from '../../../interfaces/User.interface';
import { GetDataService } from '../../../services/getData/get-data.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class UsersComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private _localStorageService: LocalStorageService,
        private getDataService: GetDataService
    ) {
        this.dataForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
            userAccess: new FormControl(1, [
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
            picture: new FormControl(''),
            formations: new FormArray([]),
        });
    }
    environment = environment;
    readonly API_URL = `${environment.apiUrl}/users`;
    dataForm: FormGroup<any>;
    users: User[] = [];
    filteredRues: any[] = [];
    selectedUser: any = {
        birthday: new Date(),
    };
    isAdding: boolean = false;
    isEditing: boolean = false;
    itemsPerPage: number = 10;
    displayConfirmationDelete = false;
    displayConfirmationDialog = false;

    storedValue: any;
    rues: any[] = [];

    date!: Date;

    ngOnInit() {
        this.getUsers();
        this.getDataService.rues$.subscribe(rues => {
            this.rues = rues.map(rue => ({
                value: rue._id,
                label: rue.nomComplet,
            }));
        });
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    getUsers() {
        let url = `${this.API_URL}`;
        this.http.get<User[]>(url).subscribe({
            next: data => {
                this.users = data.filter(user => !user.deletedAt);
                // console.log(this.users);
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

    addUser(user: any) {
        let url = `${this.API_URL}`;
        console.log(this.dataForm.value);
        this.http.post<User>(url, this.dataForm.value).subscribe({
            next: data => {
                this.users.push(data);
                this.isAdding = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'User ajouté',
                });
                this.dataForm.reset();
                this.getUsers();
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

    editUser(id: number, user: any) {
        if (!user) {
            console.error('Données invalides', user);
            return;
        }
        console.log('user update', user);
        const updatedUser = {
            ...user,
            matricule: { ...user.matricule },
            email: { ...user.email },
            password: { ...user.password },
            userAccess: { ...user.userAccess },
            firstname: { ...user.firstname },
            lastname: { ...user.lastname },
            birthday: { ...user.birthday },
            tel: { ...user.tel },
            iceContact: { ...user.iceContact },
            picture: { ...user.picture },
            formations: { ...user.formations },
        };

        const url = `${this.API_URL}/${this.selectedUser._id}`;

        this.http.patch<User>(url, this.dataForm.value).subscribe({
            // this.http.patch<any>(url, updatedUser).subscribe({
            next: data => {
                const index = this.users.findIndex(a => a._id === data._id);
                this.users[index] = data;
                this.selectedUser = {};
                this.isEditing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.getUsers();
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

    onConfirmDelete(user: User) {
        this.displayConfirmationDelete = true;
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer cet user ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteUser(user._id);
            },
        });
    }

    deleteUser(id: number) {
        this.http.delete<User>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.users = this.users.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'User effacé',
                });
                this.getUsers();
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
                this.getUsers(); // Met à jour la liste
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
                this.getUsers(); // Met à jour la liste
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
    selectUser(user: User) {
        this.selectedUser = { ...user };
        console.log("Sélection de l'user", this.selectedUser);
        const birthday = user?.birthday ? new Date(user.birthday) : null; // Convertit la date en instance de date si elle existe
        this.dataForm.patchValue({
            email: user?.email,
            password: user?.password,
            userAccess: user?.userAccess,
            matricule: user?.matricule,
            firstname: user?.firstname,
            lastname: user?.lastname,
            birthday: birthday,
            tel: user?.tel,
            iceContact: user?.iceContact,
            picture: user?.picture,
            formations: user?.formations || [],
        });
        console.log('Data form value: ', this.dataForm.value);
    }

    cancel() {
        this.selectedUser = {};
        this.isAdding = false;
        this.isEditing = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedUser = {};
        this.dataForm.reset();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        console.log(this.selectedUser);
    }
    clear(table: Table) {
        table.clear();
    }

    addFormation(): void {
        // this.dataForm.formations.push(this.dataForm.control(''));
    }

    removeFormation(index: number): void {
        // this.formations.removeAt(index);
    }

    get isDialogVisible(): boolean {
        return this.isAdding || this.isEditing;
      }
    
}
