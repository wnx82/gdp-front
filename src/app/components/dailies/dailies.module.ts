import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailiesRoutingModule } from './dailies-routing.module';
import { DailiesComponent } from './dailies.component';


@NgModule({
  declarations: [
    DailiesComponent
  ],
  imports: [
    CommonModule,
    DailiesRoutingModule
  ]
})
export class DailiesModule { }
