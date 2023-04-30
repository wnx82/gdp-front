import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [ConstatsComponent],
    imports: [CommonModule, ConstatsRoutingModule, SharedUiModule],
})
export class ConstatsModule {}
