import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './agents.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { DialogModule } from 'primeng/dialog';

@NgModule({
    declarations: [AgentsComponent],
    imports: [
        CommonModule,
        AgentsRoutingModule,
        FormsModule,
        ButtonModule,
        PaginatorModule,
        InputTextModule,
        DialogModule,
    ],
})
export class AgentsModule {}
