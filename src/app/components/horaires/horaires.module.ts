import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorairesRoutingModule } from './horaires-routing.module';
import { HorairesComponent } from './horaires.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HorairesComponent
  ],
  imports: [
    CommonModule,
    HorairesRoutingModule,
    FormsModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ReactiveFormsModule
  ]
})
export class HorairesModule { }
