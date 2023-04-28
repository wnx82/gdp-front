import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './agents.component';
// import { AgentDetailsComponent } from './agent-details/agent-details.component';

const routes: Routes = [
  { path: '', component: AgentsComponent },
  // { path: 'agents/:id', component: AgentDetailsComponent }
];
@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }


