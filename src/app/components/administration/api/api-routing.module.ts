import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiComponent } from './api.component';

const routes: Routes = [
    { path: '', component: ApiComponent },
    // { path: 'logs', component:  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApiRoutingModule {}
