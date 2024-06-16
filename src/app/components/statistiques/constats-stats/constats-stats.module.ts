import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstatsStatsComponent } from './constats-stats.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
@NgModule({
    declarations: [ConstatsStatsComponent],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        SharedUiModule,
        BrowserAnimationsModule,
        ChartModule,
    ],
    exports: [ConstatsStatsComponent],
    providers: [],
    bootstrap: [ConstatsStatsComponent],
})
export class ConstatsStatsModule {}
