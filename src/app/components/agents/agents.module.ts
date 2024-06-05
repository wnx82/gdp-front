import { NgModule } from '@angular/core';
import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './agents.component';

import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
// import { CreateAgentComponent } from './create-agent/create-agent.component';
// import { EditAgentComponent } from './edit-agent/edit-agent.component';

@NgModule({
    declarations: [AgentsComponent, ],
    imports: [SharedUiModule, AgentsRoutingModule],
})
export class AgentsModule {}
