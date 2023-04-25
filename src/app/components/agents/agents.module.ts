import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './agents.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';

import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
// import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { TableModule } from 'primeng/table';

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
        CardModule,
        AutoCompleteModule,
        CalendarModule,
        CheckboxModule,
        ToastModule,
        ReactiveFormsModule,
        InputTextareaModule,
        ConfirmDialogModule,
        HttpClientModule,
        TableModule,
    ],
})
export class AgentsModule {}
