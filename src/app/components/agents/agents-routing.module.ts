import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './agents.component';
// import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
const routes: Routes = [
    { path: '', component: AgentsComponent },
    { path: 'create', component: CreateAgentComponent },
    { path: 'edit', component: EditAgentComponent },
    // { path: 'agents/:id', component: AgentDetailsComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgentsRoutingModule {}
