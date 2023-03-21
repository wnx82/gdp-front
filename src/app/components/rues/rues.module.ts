import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuesRoutingModule } from './rues-routing.module';
import { RuesComponent } from './rues.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng

import { DialogModule } from 'primeng/dialog';
@NgModule({
    declarations: [RuesComponent],
    imports: [
        CommonModule,
        RuesRoutingModule,
        FormsModule,
        ButtonModule,
        PaginatorModule,
        InputTextModule,
        DialogModule,
    ],
})
export class RuesModule {}
