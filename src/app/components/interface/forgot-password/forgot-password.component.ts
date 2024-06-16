import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedUiModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    providers: [MessageService],
})
export class ForgotPasswordComponent {
    forgetPasswordForm: FormGroup;
    private apiUrl: string = environment.apiUrl;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private messageService: MessageService,
        private router: Router
    ) {
        this.forgetPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    async onSubmit() {
        if (this.forgetPasswordForm.valid) {
            const email = this.forgetPasswordForm.get('email')?.value;

            try {
                await firstValueFrom(
                    this.http.post(`${this.apiUrl}/forgot-password`, { email })
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Lien de réinitialisation envoyé à votre email.',
                });
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000); // Délai de 3 secondes
            } catch (error) {
                console.error('Erreur :', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Échec de l'envoi du lien de réinitialisation.",
                });
            }
        }
    }

    isPasswordButtonEnabled() {
        return this.forgetPasswordForm.controls['email'].valid;
    }
}
