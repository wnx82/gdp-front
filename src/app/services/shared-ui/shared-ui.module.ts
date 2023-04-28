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
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
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
        MultiSelectModule,
        TagModule,
        MessageModule,
        MessagesModule,
        ToggleButtonModule,
        AccordionModule,
        SkeletonModule,
        FieldsetModule,
    ],
    providers: [MessageService],
})
export class SharedUiModule {}
