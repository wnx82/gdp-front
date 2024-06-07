import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { CreateConstatComponent } from './create-constat/create-constat.component';
import { EditConstatComponent } from './edit-constat/edit-constat.component';

@NgModule({
    declarations: [
        ConstatsComponent,
        CreateConstatComponent,
        EditConstatComponent,
    ],
    imports: [CommonModule, ConstatsRoutingModule, SharedUiModule],
})
export class ConstatsModule {}
