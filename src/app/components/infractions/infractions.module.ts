import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfractionsRoutingModule } from './infractions-routing.module';
import { InfractionsComponent } from './infractions.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [InfractionsComponent],
    imports: [CommonModule, InfractionsRoutingModule, SharedUiModule],
})
export class InfractionsModule {}
