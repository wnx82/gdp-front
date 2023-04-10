import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';

@NgModule({
  declarations: [DashboardComponent, StatisticsComponent], // Add StatisticsComponent to declarations
  imports: [CommonModule],
  exports: [DashboardComponent],
})
export class DashboardModule { }