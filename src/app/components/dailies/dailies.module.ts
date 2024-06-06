import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailiesRoutingModule } from './dailies-routing.module';
import { DailiesComponent } from './dailies.component';

import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
import { CreateDailiesComponent } from './create-dailies/create-dailies.component';
import { IdDailieComponent } from './id-dailie/id-dailie.component';

@NgModule({
    declarations: [DailiesComponent, CreateDailiesComponent, IdDailieComponent],
    imports: [CommonModule, DailiesRoutingModule, SharedUiModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DailiesModule {}
