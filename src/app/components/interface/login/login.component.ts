import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import { Router,RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { StatusService } from '../../../services/status/status.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedUiModule,RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    private apiUrl: string = environment.apiUrl;
    loginForm!: FormGroup;
    checkoutForm!: FormGroup;
    registerForm!: FormGroup;
    isSignDivVisible: boolean = true;
    isCheckoutDivVisible: boolean = false;
    isRegisterDivVisible: boolean = false;
    showLoader: boolean = true;
    isActive: boolean = false; // Variable pour gérer l'état du conteneur

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private statusService: StatusService,
    ) {
        // Partie login
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.minLength(3)]),
        });
        // Partie checkout
        this.checkoutForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            birthday: new FormControl('', [Validators.required]),
        });

        // Partie Register
        this.registerForm = this.fb.group({
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
            ]),
        });
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
                    detail: 'Erreur lors de la vérification du statut de la base de données : ' + error,
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
                let errorMessage = 'Une erreur est survenue lors de la connexion.';
                if (error.status === 401) {
                    errorMessage = 'Mot de passe incorrect.';
                } else if (error.status === 403) {
                    errorMessage = 'Votre compte est désactivé. Veuillez contacter le support.';
                } else if (error.status === 404) {
                    errorMessage = 'Adresse email incorrecte.';
                } else if (error.status === 500) {
                    errorMessage = 'Erreur interne du serveur.';
                } else {
                    errorMessage = error.error ? error.error.message : errorMessage;
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

    isLoginButtonEnabled() {
        return this.loginForm.controls['email'].valid && this.loginForm.controls['password'].valid;
    }

    isCheckoutButtonEnabled() {
        return this.checkoutForm.controls['email'].valid && this.checkoutForm.controls['birthday'].valid;
    }

    isRegisterButtonEnabled() {
        return this.registerForm.controls['password'].valid;
    }

    onRegisterButtonClick(): void {
        this.isSignDivVisible = false;
        this.isCheckoutDivVisible = true;
        this.isRegisterDivVisible = false;
    }

    onConnectButtonClick(): void {
        this.isSignDivVisible = true;
        this.isCheckoutDivVisible = false;
        this.isRegisterDivVisible = false;
    }
}
