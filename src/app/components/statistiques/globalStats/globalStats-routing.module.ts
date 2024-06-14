import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { globalStats } from './globalStats.component';

const routes: Routes = [{ path: '', component: globalStats }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
