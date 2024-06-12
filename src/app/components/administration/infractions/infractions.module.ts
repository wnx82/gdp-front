import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfractionsRoutingModule } from './infractions-routing.module';
import { InfractionsComponent } from './infractions.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { CreateInfractionComponent } from './create-infraction/create-infraction.component';
import { EditInfractionComponent } from './edit-infraction/edit-infraction.component';

@NgModule({
    declarations: [InfractionsComponent, CreateInfractionComponent, EditInfractionComponent],
    imports: [CommonModule, InfractionsRoutingModule, SharedUiModule],
})
export class InfractionsModule {}
