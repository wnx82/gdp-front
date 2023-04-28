import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { StatisticsModule } from 'src/app/components/statistics/statistics.module';

@NgModule({
    declarations: [DashboardComponent, StatisticsComponent], // Add StatisticsComponent to declarations
    imports: [CommonModule, SharedUiModule, StatisticsModule],
    exports: [DashboardComponent],
    bootstrap: [DashboardComponent],
})
export class DashboardModule {}
