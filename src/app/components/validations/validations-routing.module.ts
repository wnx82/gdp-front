import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationsComponent } from './validations.component';

const routes: Routes = [{ path: '', component: ValidationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationsRoutingModule { }
