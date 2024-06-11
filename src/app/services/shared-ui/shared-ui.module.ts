import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//PrimeNG

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { RippleModule } from 'primeng/ripple';
import { InputMaskModule } from 'primeng/inputmask';
import { BadgeModule } from 'primeng/badge';


import { EditorModule } from 'primeng/editor';

import { DropdownModule } from 'primeng/dropdown';


@NgModule({
    declarations: [],
    exports: [
        AccordionModule,
        AutoCompleteModule,
        BadgeModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        FieldsetModule,
        FileUploadModule,
        FormsModule,
        HttpClientModule,
        InputTextareaModule,
        InputTextModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        PaginatorModule,
        PasswordModule,
        ReactiveFormsModule,
        RippleModule,
        SkeletonModule,
        TableModule,
        TagModule,
        ToastModule,
        ToggleButtonModule,
        InputMaskModule,
        EditorModule,
        DropdownModule
    ],
    providers: [MessageService],
})
export class SharedUiModule {}
