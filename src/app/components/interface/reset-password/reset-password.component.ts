import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedUiModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    providers: [MessageService],
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    token: string;
    private apiUrl: string = environment.apiUrl;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.resetPasswordForm = this.fb.group(
            {
                newPassword: [
                    '',
                    [Validators.required, Validators.minLength(6)],
                ],
                confirmPassword: [
                    '',
                    [Validators.required, Validators.minLength(6)],
                ],
            },
            { validator: this.passwordsMatch }
        );
        this.token = '';
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') || '';
    }

    passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
        const newPassword = group.get('newPassword');
        const confirmPassword = group.get('confirmPassword');
        if (newPassword?.value !== confirmPassword?.value) {
            return { mismatch: true };
        }
        return null;
    }

    onSubmit(): void {
        if (this.resetPasswordForm.valid) {
            const newPassword =
                this.resetPasswordForm.get('newPassword')?.value;

            this.http
                .post(
                    `${this.apiUrl}/forgot-password/reset-password/${this.token}`,
                    { newPassword }
                )
                .subscribe(
                    () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Password has been reset successfully.',
                        });
                        this.router.navigate(['/login']);
                    },
                    error => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to reset password. Token might be expired or invalid.',
                        });
                    }
                );
        }
    }
}
