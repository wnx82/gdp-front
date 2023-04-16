import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfractionsRoutingModule } from './infractions-routing.module';
import { InfractionsComponent } from './infractions.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    InfractionsComponent
  ],
  imports: [
    CommonModule,
    InfractionsRoutingModule,
    FormsModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ReactiveFormsModule,
    TableModule
  ]
})
export class InfractionsModule { }
