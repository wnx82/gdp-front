import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionsComponent } from './missions.component';

const routes: Routes = [{ path: '', component: MissionsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MissionsRoutingModule {}
