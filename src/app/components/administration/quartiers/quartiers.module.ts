import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuartiersRoutingModule } from './quartiers-routing.module';
import { QuartiersComponent } from './quartiers.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [QuartiersComponent],
    imports: [CommonModule, QuartiersRoutingModule, SharedUiModule],
})
export class QuartiersModule {}
