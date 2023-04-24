import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsHabitationComponent } from './details-habitation.component';

const routes: Routes = [{ path: '', component: DetailsHabitationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsHabitationRoutingModule { }
