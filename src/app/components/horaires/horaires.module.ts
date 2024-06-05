import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorairesRoutingModule } from './horaires-routing.module';
import { HorairesComponent } from './horaires.component';

import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
@NgModule({
    declarations: [HorairesComponent],
    imports: [CommonModule, HorairesRoutingModule, SharedUiModule],
})
export class HorairesModule {}
