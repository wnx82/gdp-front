import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Infraction } from '../../../interfaces/Infraction.interface';

@Component({
    selector: 'app-infractions',
    templateUrl: './infractions.component.html',
    styleUrls: ['./infractions.component.css'],
    providers: [MessageService],
})
export class InfractionsComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    donnees: Infraction[] = [];
    selectedData: any = {};
    isAdding: boolean = false;
    isEditing: boolean = false;
    displayConfirmationDialog = false;
    isDialogVisible: boolean = false;
    dataForm = new FormGroup({
        category: new FormControl('', [Validators.required]),
        priority: new FormControl(''),
        list: new FormArray([]),
    });
    newArticleForm = new FormGroup({
        article: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    });

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}
    readonly API_URL = `${environment.apiUrl}/infractions`;

    ngOnInit(): void {
        this.get();
    }

    get() {
        this.http.get<Infraction[]>(this.API_URL).subscribe({
            next: data => {
                this.donnees = data.filter(donnee => !donnee.deletedAt);
            },
            error: error => {
                console.log(error);
            },
        });
    }

    add(donnee: any) {
        this.http.post<Infraction>(`${this.API_URL}`, donnee).subscribe({
            next: data => {
                this.donnees.push(data);
                this.isAdding = false;
                this.isDialogVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Donnée ajoutée',
                });
                this.dataForm.reset();
                this.get();
            },
            error: error => {
                this.handleError(error);
            },
        });
    }

    edit(id: number, donnee: any) {
        const url = `${this.API_URL}/${id}`;

        this.http.patch<Infraction>(url, donnee).subscribe({
            next: data => {
                const index = this.donnees.findIndex(a => a._id === data._id);
                this.donnees[index] = data;
                this.selectedData = {};
                this.isEditing = false;
                this.isDialogVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modification effectuée',
                });
                this.dataForm.reset();
                this.get();
            },
            error: error => {
                this.handleError(error);
            },
        });
    }

    deleteDonnee(id: number) {
        this.http.delete<Infraction>(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                this.donnees = this.donnees.filter(a => a._id !== id);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Suppression',
                    detail: 'Donnée effacée',
                });
                this.get();
            },
            error: error => {
                console.log(error);
            },
        });
    }

    deleteDeleted(): void {
        this.displayConfirmationDialog = true;
    }

    confirmDeleteDeleted(): void {
        const url = `${this.API_URL}/purge`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été complètement effacées',
                });
                this.get();
            },
            error: error => {
                this.handleError(error);
            },
            complete: () => {
                this.displayConfirmationDialog = false;
            },
        });
    }

    confirmRestoreDeleted(): void {
        const url = `${this.API_URL}/restore`;
        this.http.post(url, {}).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les données ont été restaurées avec succès',
                });
                this.get();
            },
            error: error => {
                this.handleError(error);
            },
        });
    }

    selectData(donnee: any) {
        this.selectedData = { ...donnee };
        this.dataForm.patchValue(this.selectedData);
        const list = this.dataForm.get('list') as FormArray;
        list.clear();
        this.selectedData.list.forEach((item: any) => {
            list.push(new FormGroup({
                article: new FormControl(item[0]),
                description: new FormControl(item[1])
            }));
        });
        this.isDialogVisible = true;
    }

    cancel() {
        this.selectedData = {};
        this.isAdding = false;
        this.isEditing = false;
        this.isDialogVisible = false;
    }

    toggleAdd() {
        this.isAdding = !this.isAdding;
        this.selectedData = {};
        this.dataForm.reset();
        this.isDialogVisible = this.isAdding;
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        this.isDialogVisible = this.isEditing;
    }

    clear(table: any) {
        table.clear();
    }

    addRow() {
        const list = this.dataForm.get('list') as FormArray;
        list.push(new FormGroup({
            article: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        }));
    }

    deleteRow(donnee: any, rowIndex: number) {
        const list = donnee.list as any[];
        list.splice(rowIndex, 1);
    }

    deleteRowFromList(rowIndex: number) {
        const list = this.dataForm.get('list') as FormArray;
        list.removeAt(rowIndex);
    }

    saveNewRow() {
        const newRow = this.newArticleForm.value;
        const list = this.dataForm.get('list') as FormArray;
        list.push(new FormGroup({
            article: new FormControl(newRow.article),
            description: new FormControl(newRow.description)
        }));
        this.newArticleForm.reset();
    }

    get list(): any[] {
        return this.dataForm.get('list')?.value || [];
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message,
        });
    }
}
