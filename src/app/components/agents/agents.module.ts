import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './agents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [AgentsComponent],
    imports: [
        CommonModule,
        AgentsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedUiModule,
    ],
})
export class AgentsModule {}
