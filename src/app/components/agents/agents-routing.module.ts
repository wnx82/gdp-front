import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsListComponent } from './agents-list/agents-list.component';

const routes: Routes = [
  { path: '', component: AgentsListComponent },
  { path: ':id', component: AgentsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {}
