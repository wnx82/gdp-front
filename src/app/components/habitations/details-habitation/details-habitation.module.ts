import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsHabitationRoutingModule } from './details-habitation-routing.module';
import { DetailsHabitationComponent } from './details-habitation.component';


@NgModule({
  declarations: [
    DetailsHabitationComponent
  ],
  imports: [
    CommonModule,
    DetailsHabitationRoutingModule
  ]
})
export class DetailsHabitationModule { }
