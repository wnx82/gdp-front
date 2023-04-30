import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuesRoutingModule } from './rues-routing.module';
import { RuesComponent } from './rues.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [RuesComponent],
    imports: [CommonModule, RuesRoutingModule, SharedUiModule],
})
export class RuesModule {}
