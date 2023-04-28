import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';
// import { StatisticsComponent } from '../../components/statistics/statistics.component';

@NgModule({
    declarations: [DashboardComponent], // Add StatisticsComponent to declarations
    imports: [CommonModule, SharedUiModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
