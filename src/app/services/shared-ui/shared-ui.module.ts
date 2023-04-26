import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextareaModule,
        InputTextModule,
        PaginatorModule,
        PasswordModule,
        TableModule,
        ToastModule,
        FileUploadModule,
    ],
})
export class SharedUiModule {}
