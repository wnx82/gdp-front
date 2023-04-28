import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatsComponent } from './constats.component';

const routes: Routes = [{ path: '', component: ConstatsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstatsRoutingModule { }
