import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailiesRoutingModule } from './dailies-routing.module';
import { DailiesComponent } from './dailies.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [DailiesComponent],
    imports: [CommonModule, DailiesRoutingModule, SharedUiModule],
})
export class DailiesModule {}
