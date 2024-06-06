import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissionsRoutingModule } from './missions-routing.module';
import { MissionsComponent } from './missions.component';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [MissionsComponent],
    imports: [CommonModule, MissionsRoutingModule, SharedUiModule],
    providers: [],
})
export class MissionsModule {}
