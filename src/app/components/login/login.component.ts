import { MessageService } from 'primeng/api';
import { Component, OnInit, LOCALE_ID } from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../environments/environment';
import { RegisterService } from '../../services/register/register.service';
import { StatusService } from '../../services/status/status-service.service'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedUiModule],
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

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private statusService: StatusService,
        // private registerService: RegisterService
    ) {
        //Partie login
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.minLength(3)]),
        });
        //Partie checkout
        this.checkoutForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            birthday: new FormControl('', [Validators.required]),
        });

        //Partie Register
        this.registerForm = this.fb.group({
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
            ]),
        });
    }

    //partie Register

    ngOnInit(): void {
        //
        this.checkDatabaseStatus();
        setTimeout(() => {
            this.showLoader = false;
        }, 100);
    }
    checkDatabaseStatus() {
        this.statusService.checkDatabaseStatus().subscribe(
            response => {
                // Base de données connectée, affichez un message de succès ou faites toute autre action nécessaire
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'La base de données est connectée.',
                });
            },
            error => {
                // Erreur lors de la vérification du statut de la base de données, affichez un message d'erreur ou prenez toute autre action nécessaire
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de la vérification du statut de la base de données : ' + error,
                });
            }
        );
    }

    onLogin() {
        // debugger;
        const { email, password } = this.loginForm.value;

        console.log(email, password);
        this.authService.login(email, password).subscribe(
            response => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Connecté',
                });
                console.log('Connecté avec succès !');
                console.log('Token d\'accès:', this.authService.accessToken); // Accès au jeton d'accès directement à partir du service
                this.router.navigate(['/dashboard']);
            },
            error => {
                let errorMessage = 'Une erreur est survenue lors de la connexion.';
                if (error.status === 401) {
                    errorMessage = 'Mot de passe incorrect.';
                } else if (error.status === 403) {
                    errorMessage = 'Accès refusé.';
                } else if (error.status === 404) {
                    errorMessage = 'Ressource non trouvée.';
                } else if (error.status === 500) {
                    errorMessage = 'Erreur interne du serveur.';
                } else {
                    console.error('Erreur lors de la connexion : ', error);
                }
    
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: errorMessage,
                });
            }
        );
        // const localUsers = localStorage.getItem('users');
        // if (localUsers != null) {
        //     const users = JSON.parse(localUsers);

        //     const isUserPresent = users.find(
        //         (user: SignUpModel) =>
        //             user.email == this.loginData.email &&
        //             user.password == this.loginData.password
        //     );
        //     if (isUserPresent != undefined) {
        //         alert('User Found...');
        //         localStorage.setItem(
        //             'loggedUser',
        //             JSON.stringify(isUserPresent)
        //         );
        //         this.router.navigateByUrl('/dashboard');
        //     } else {
        //         alert('No User Found');
        //     }
        // }
    }

    // login.component.ts


    isLoginButtonEnabled() {
        return (
            this.loginForm.controls['email'].valid &&
            this.loginForm.controls['password'].valid
        );
    }

    isCheckoutButtonEnabled() {
        return (
            this.checkoutForm.controls['email'].valid &&
            this.checkoutForm.controls['birthday'].valid
        );
    }
    isRegisterButtonEnabled() {
        return this.registerForm.controls['password'].valid;
    }

    onRegisterButtonClick(): void {
        // Fonction à exécuter lors du clic sur le bouton "Checkout"
        this.isSignDivVisible = false;
        this.isCheckoutDivVisible = true;
        // ne pas oublié de mettre à false register
        this.isRegisterDivVisible = false;
    }

    onConnectButtonClick(): void {
        // Fonction à exécuter lors du clic sur le bouton "S'inscrire"
        this.isSignDivVisible = true;
        this.isCheckoutDivVisible = false;
        this.isRegisterDivVisible = false;
    }
}