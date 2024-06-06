import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuartiersComponent } from './quartiers.component';

const routes: Routes = [{ path: '', component: QuartiersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuartiersRoutingModule { }
