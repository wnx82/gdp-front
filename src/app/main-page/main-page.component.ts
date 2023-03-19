import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  menuItems: MenuItem[] = [
    { label: 'Home', routerLink: ['/'] },
    { label: 'Agents', routerLink: ['/agents'] },
    { label: 'Habitations', routerLink: ['/habitations'] },
    { label: 'Valider une habitation', routerLink: ['/valider-habitation'] },
    { label: 'Administration', routerLink: ['/administration'] },
    { label: 'error404', routerLink: ['/error404'] },
  ];
}
