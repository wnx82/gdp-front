import { NgModule } from '@angular/core';
import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './agents.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';


@NgModule({
    declarations: [AgentsComponent, ],
    imports: [SharedUiModule, AgentsRoutingModule],
})
export class AgentsModule {}
