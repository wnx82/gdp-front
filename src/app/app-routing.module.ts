import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },

    {
        path: 'agents',
        loadChildren: () =>
            import('./components/agents/agents.module').then(
                m => m.AgentsModule
            ),
    },
    {
        path: 'rues',
        loadChildren: () =>
            import('./components/rues/rues.module').then(m => m.RuesModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
