import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuesComponent } from './rues.component';

const routes: Routes = [{ path: '', component: RuesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuesRoutingModule { }
