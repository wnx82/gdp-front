import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstatsRoutingModule } from './constats-routing.module';
import { ConstatsComponent } from './constats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [ConstatsComponent],
    imports: [
        CommonModule,
        ConstatsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedUiModule,
    ],
})
export class ConstatsModule {}
