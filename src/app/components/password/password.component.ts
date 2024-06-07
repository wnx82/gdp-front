import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {
  token: string | undefined;
  forgetPasswordForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.token = this.generateToken();
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: [this.token, [Validators.required, Validators.minLength(3)]],
      
    });

  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      // Handle form submission
    }
  }
  generateToken(): string {
    const array = new Uint32Array(10);
    window.crypto.getRandomValues(array);
    const token = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    setTimeout(() => {
      this.token = ''; // Expire le token après 10 minutes
    }, 10 * 60 * 1000);
    return token;
    
  }
  isPasswordButtonEnabled() {
    return (
        this.forgetPasswordForm.controls['email'].valid &&
        this.forgetPasswordForm.controls['token'].valid
    );
}
}



