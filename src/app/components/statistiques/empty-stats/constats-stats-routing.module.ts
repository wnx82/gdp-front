import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatsStatsComponent } from './constats-stats.component';

const routes: Routes = [{ path: '', component: ConstatsStatsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
