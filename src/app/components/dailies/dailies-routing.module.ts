import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailiesComponent } from './dailies.component';
import { CreateDailiesComponent } from './create-dailies/create-dailies.component';

const routes: Routes = [
    { path: '', component: DailiesComponent },
    { path: 'create', component: CreateDailiesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DailiesRoutingModule {}
