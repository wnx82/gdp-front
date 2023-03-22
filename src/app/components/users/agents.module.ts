import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsListComponent } from './agents-list/agents-list.component';

@NgModule({
  declarations: [AgentsListComponent],
  imports: [CommonModule, AgentsRoutingModule],
})
export class AgentsModule {}
