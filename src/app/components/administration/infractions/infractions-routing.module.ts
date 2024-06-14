import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInfractionComponent } from './create-infraction/create-infraction.component';
import { EditInfractionComponent } from './edit-infraction/edit-infraction.component';
import { InfractionsComponent } from './infractions.component';



const routes: Routes = [
  { path: 'create', component: CreateInfractionComponent },
  { path: ':id', component: EditInfractionComponent },
  { path: '', component: InfractionsComponent },
  // Add other routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfractionsRoutingModule { }
