import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RapportsRoutingModule } from './rapports-routing.module';
import { RapportsComponent } from './rapports.component';
import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';
import { CreateRapportComponent } from './create-rapport/create-rapport.component';
import { IdRapportComponent } from './id-rapport/id-rapport.component';

@NgModule({
    declarations: [RapportsComponent, CreateRapportComponent, IdRapportComponent],
    imports: [CommonModule, RapportsRoutingModule, SharedUiModule],
})
export class RapportsModule {}
