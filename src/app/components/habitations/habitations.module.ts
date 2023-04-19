import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitationsRoutingModule } from './habitations-routing.module';
import { HabitationsComponent } from './habitations.component';


@NgModule({
  declarations: [
    HabitationsComponent
  ],
  imports: [
    CommonModule,
    HabitationsRoutingModule
  ]
})
export class HabitationsModule { }
