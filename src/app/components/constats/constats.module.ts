import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
    declarations: [ConstatsComponent],
    imports: [
        CommonModule,
        ConstatsRoutingModule,
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
        TagModule,
        MessageModule,
        MessagesModule,
    ],
})
export class ConstatsModule {}
