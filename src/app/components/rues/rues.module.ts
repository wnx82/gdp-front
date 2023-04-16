import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuesRoutingModule } from './rues-routing.module';
import { RuesComponent } from './rues.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';

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
        CheckboxModule,
        ToastModule,
        ReactiveFormsModule,
        InputTextareaModule,
        ConfirmDialogModule,
        HttpClientModule,
        TableModule
    ],
})
export class RuesModule { }
