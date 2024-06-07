import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedUiModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export class ForgotPasswordComponent {
  forgetPasswordForm: FormGroup;
  private apiUrl: string = environment.apiUrl;

  constructor(private fb: FormBuilder, private http: HttpClient, private messageService: MessageService) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email')?.value;

      this.http.post(`${this.apiUrl}/forgot-password`, { email }).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reset link sent to your email.' });
        },
        error => {
          console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send reset link.' });
        }
      );
    }
  }

  isPasswordButtonEnabled() {
    return this.forgetPasswordForm.controls['email'].valid;
  }
}
