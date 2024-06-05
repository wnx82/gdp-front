import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorairesComponent } from './horaires.component';

const routes: Routes = [{ path: '', component: HorairesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorairesRoutingModule { }
