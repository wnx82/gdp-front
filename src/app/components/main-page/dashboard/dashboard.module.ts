import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { globStatisticsModule } from '../../statistiques/globalStats/globalStats.module';
import { ConstatsStatsModule } from '../../statistiques/constats-stats/constats-stats.module';
@NgModule({
    declarations: [DashboardComponent], // Add StatisticsComponent to declarations
    imports: [CommonModule,ConstatsStatsModule,globStatisticsModule, SharedUiModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
