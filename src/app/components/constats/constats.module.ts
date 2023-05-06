import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';
import { CreateConstatComponent } from './create-constat/create-constat.component';

@NgModule({
    declarations: [ConstatsComponent, CreateConstatComponent],
    imports: [CommonModule, ConstatsRoutingModule, SharedUiModule],
})
export class ConstatsModule {}
