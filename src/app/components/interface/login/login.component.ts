import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { StatusService } from '../../../services/status/status.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

function passwordMatchValidator(
    control: AbstractControl
): { [key: string]: boolean } | null {
    const password = control.get('passwordRegister');
    const confirmPassword = control.get('passwordRegisterVerification');
    if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
    ) {
        return { mismatch: true };
    }
    return null;
}
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedUiModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    loginForm!: FormGroup;
    checkoutForm!: FormGroup;
    registerForm!: FormGroup;
    isSignDivVisible: boolean = true;
    isRegisterDivVisible: boolean = false;
    showLoader: boolean = true;
    isActive: boolean = false; // Variable pour gérer l'état du conteneur

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private statusService: StatusService
    ) {
        // Partie login
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
            ]),
        });

        // Partie Register
        this.registerForm = this.fb.group(
            {
                emailRegister: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                passwordRegister: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                ]),
                passwordRegisterVerification: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                ]),
            },
            { validator: passwordMatchValidator }
        );
    }

    ngOnInit(): void {
        this.checkDatabaseStatus();
        setTimeout(() => {
            this.showLoader = false;
        }, 100);
    }

    checkDatabaseStatus() {
        this.statusService.checkDatabaseStatus().subscribe(
            response => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'La base de données est connectée.',
                });
            },
            error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail:
                        'Erreur lors de la vérification du statut de la base de données : ' +
                        error,
                });
            }
        );
    }

    toggleRegister(): void {
        this.isActive = true;
    }

    toggleConnect(): void {
        this.isActive = false;
    }

    onLogin() {
        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe(
            response => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Connecté',
                });
                this.router.navigate(['/dashboard']);
            },
            error => {
                let errorMessage =
                    'Une erreur est survenue lors de la connexion.';
                if (error.status === 401) {
                    errorMessage = 'Mot de passe incorrect.';
                } else if (error.status === 403) {
                    errorMessage =
                        'Votre compte est désactivé. Veuillez contacter le support.';
                } else if (error.status === 404) {
                    errorMessage = 'Adresse email incorrecte.';
                } else if (error.status === 500) {
                    errorMessage = 'Erreur interne du serveur.';
                } else {
                    errorMessage = error.error
                        ? error.error.message
                        : errorMessage;
                    console.error('Erreur lors de la connexion : ', error);
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: errorMessage,
                });
            }
        );
    }
    onRegister() {
        const { emailRegister, passwordRegisterVerification } =
            this.registerForm.value;
        const enable = false;
        const userAccess = 10;
        const matricule = Math.floor(Math.random() * 701) + 200;

        // Log des valeurs avant l'appel de l'API
        console.log('Registering with values:', {
            emailRegister,
            passwordRegisterVerification,
            enable,
            userAccess,
            matricule,
        });

        this.authService
            .register(
                emailRegister,
                passwordRegisterVerification,
                enable,
                userAccess,
                matricule
            )
            .subscribe(
                response => {
                    console.log('Registration successful:', response);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Compte créé avec succès',
                    });
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log('Registration error:', error);

                    let errorMessage =
                        'Une erreur est survenue lors de la création du compte.';
                    if (error.status === 400) {
                        errorMessage = 'Requête invalide.';
                    } else if (error.status === 409) {
                        errorMessage = 'Email déjà utilisé.';
                    } else if (error.status === 500) {
                        errorMessage = 'Erreur interne du serveur.';
                    } else {
                        errorMessage = error.error
                            ? error.error.message
                            : errorMessage;
                        console.error(
                            'Erreur lors de la création du compte : ',
                            error
                        );
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage,
                    });
                }
            );
    }

    isLoginButtonEnabled() {
        return (
            this.loginForm.controls['email'].valid &&
            this.loginForm.controls['password'].valid
        );
    }

    isRegisterButtonEnabled() {
        return (
            this.registerForm.controls['emailRegister'].valid &&
            this.registerForm.controls['passwordRegister'].valid &&
            this.registerForm.controls['passwordRegisterVerification'].valid &&
            !this.registerForm.errors?.['mismatch']
        );
    }
}
