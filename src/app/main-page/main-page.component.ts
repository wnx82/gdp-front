// app.component.ts
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  showMenu = false;

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/'],
    },
    {
      label: 'Agents',
      icon: 'pi pi-users',
      routerLink: ['/agents'],
    },
    {
      label: 'Habitations',
      icon: 'pi pi-home',
      routerLink: ['/habitations'],
    },
    {
      label: 'Valider une habitation',
      icon: 'pi pi-check-square',
      routerLink: ['/validation-habitation'],
    },
    {
      label: 'Administration',
      icon: 'pi pi-cog',
      routerLink: ['/administration'],
    },
    {
      label: 'error404',
      icon: 'pi pi-exclamation-triangle',
      routerLink: ['/error404'],
    },
  ];
}
