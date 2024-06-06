import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailiesComponent } from './dailies.component';
import { CreateDailiesComponent } from './create-dailies/create-dailies.component';
import { IdDailieComponent } from './id-dailie/id-dailie.component';
const routes: Routes = [
    { path: '', component: DailiesComponent },
    { path: 'create', component: CreateDailiesComponent },
    { path: ':id', component: IdDailieComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DailiesRoutingModule {}
