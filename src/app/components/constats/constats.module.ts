import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';


@NgModule({
  declarations: [
    ConstatsComponent
  ],
  imports: [
    CommonModule,
    ConstatsRoutingModule
  ]
})
export class ConstatsModule { }
