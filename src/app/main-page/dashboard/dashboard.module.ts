import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedUiModule } from '../../services/shared-ui/shared-ui.module';
import { StatisticsModule } from '../../components/statistics/statistics.module';
@NgModule({
    declarations: [DashboardComponent], // Add StatisticsComponent to declarations
    imports: [CommonModule,StatisticsModule, SharedUiModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
