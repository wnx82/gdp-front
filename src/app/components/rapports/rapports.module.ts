import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RapportsRoutingModule } from './rapports-routing.module';
import { RapportsComponent } from './rapports.component';
import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [RapportsComponent],
    imports: [CommonModule, RapportsRoutingModule, SharedUiModule],
})
export class RapportsModule {}
