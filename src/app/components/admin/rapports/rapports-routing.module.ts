import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RapportsComponent } from './rapports.component';
import { CreateRapportComponent } from './create-rapport/create-rapport.component';
import { IdRapportComponent } from './id-rapport/id-rapport.component';

const routes: Routes = [
    { path: '', component: RapportsComponent },
    { path: 'create', component: CreateRapportComponent },
    { path: ':id', component: CreateRapportComponent },
    { path: ':id/edit', component: IdRapportComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RapportsRoutingModule {}
