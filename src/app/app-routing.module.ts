import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
import { RegistrationComponent } from './services/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';

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
        path: 'users',
        loadChildren: () =>
            import('./components/users/agents.module').then(
                m => m.AgentsModule
            ),
    },
    {
        path: 'rues',
        loadChildren: () =>
            import('./components/rues/rues.module').then(m => m.RuesModule),
    },
    {
        path: 'missions',
        loadChildren: () =>
            import('./components/missions/missions.module').then(
                m => m.MissionsModule
            ),
    },
    {
        path: 'statistics',
        loadChildren: () =>
            import('./components/statistics/statistics.module').then(
                m => m.StatisticsModule
            ),
    },
    {
        path: 'media',
        loadChildren: () =>
            import('./components/media/media.module').then(m => m.MediaModule),
    },
    {
        path: 'categories',
        loadChildren: () =>
            import('./components/categories/categories.module').then(
                m => m.CategoriesModule
            ),
    },
    {
        path: 'constats',
        loadChildren: () =>
            import('./components/constats/constats.module').then(
                m => m.ConstatsModule)
    },
    { path: 'app', loadChildren: () => import('./components/horaires/horaires.module').then(m => m.HorairesModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes),
        ReactiveFormsModule],
    exports: [RouterModule],
})
export class AppRoutingModule { }
