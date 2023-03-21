import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissionsRoutingModule } from './missions-routing.module';
import { MissionsComponent } from './missions.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng

@NgModule({
    declarations: [MissionsComponent],
    imports: [
        CommonModule,
        MissionsRoutingModule,
        FormsModule,
        ButtonModule,
        PaginatorModule,
        InputTextModule,
    ],
})
export class MissionsModule {}
