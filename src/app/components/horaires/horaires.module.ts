import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorairesRoutingModule } from './horaires-routing.module';
import { HorairesComponent } from './horaires.component';


@NgModule({
  declarations: [
    HorairesComponent
  ],
  imports: [
    CommonModule,
    HorairesRoutingModule
  ]
})
export class HorairesModule { }
