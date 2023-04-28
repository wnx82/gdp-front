import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfractionsComponent } from './infractions.component';

const routes: Routes = [{ path: '', component: InfractionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfractionsRoutingModule { }
