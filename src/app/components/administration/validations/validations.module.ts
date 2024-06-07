import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationsRoutingModule } from './validations-routing.module';
import { ValidationsComponent } from './validations.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [ValidationsComponent],
    imports: [CommonModule, ValidationsRoutingModule, SharedUiModule],
})
export class ValidationsModule {}
