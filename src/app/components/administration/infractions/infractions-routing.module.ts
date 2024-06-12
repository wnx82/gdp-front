import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfractionsComponent } from './infractions.component';
import { CreateInfractionComponent } from './create-infraction/create-infraction.component';
import { EditInfractionComponent } from './edit-infraction/edit-infraction.component';

const routes: Routes = [
  {
      path: '',
      component: InfractionsComponent,
  },
  {
      path: 'create',
      component: CreateInfractionComponent,
  },
  {
      path: ':id',
      component: EditInfractionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfractionsRoutingModule { }
