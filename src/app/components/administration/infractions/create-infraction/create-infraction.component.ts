import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-create-infraction',
    templateUrl: './create-infraction.component.html',
    styleUrls: ['./create-infraction.component.scss'],
    providers: [MessageService],
})
export class CreateInfractionComponent {
    private apiUrl: string | undefined;
    readonly API_URL = `${environment.apiUrl}/infractions`;
    dataForm = new FormGroup({
        category: new FormControl('', [Validators.required]),
        priority: new FormControl(''),
        list: new FormArray([]),
    });

    constructor(
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService
    ) {}

    get list(): FormArray {
        return this.dataForm.get('list') as FormArray;
    }

    addRow() {
        this.list.push(
            new FormGroup({
                article: new FormControl('', Validators.required),
                description: new FormControl('', Validators.required),
            })
        );
    }

    deleteRowFromList(rowIndex: number) {
        this.list.removeAt(rowIndex);
    }

    add(donnee: any) {
        this.http.post(`${this.apiUrl}/infractions`, donnee).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Donnée ajoutée',
                });
                this.router.navigate(['/infractions']);
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.message,
                });
            },
        });
    }

    navigateToInfractions() {
        this.router.navigate(['/infractions']);
    }
}
