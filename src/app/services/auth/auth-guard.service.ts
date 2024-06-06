import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('Checking authentication status...');
    console.log('isLoggedIn:', this.authService.isLoggedIn());

    if (this.authService.isLoggedIn()) {
      console.log('Access granted');
      return true;
    } else {
      console.log('Access Denied: Not logged in');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
