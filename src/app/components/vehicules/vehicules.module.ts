import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculesRoutingModule } from './vehicules-routing.module';
import { VehiculesComponent } from './vehicules.component';

import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [VehiculesComponent],
    imports: [CommonModule, VehiculesRoutingModule, SharedUiModule],
})
export class VehiculesModule {}
