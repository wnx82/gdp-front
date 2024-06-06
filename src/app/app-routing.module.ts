import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
import { RegistrationComponent } from './services/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from './services/shared-ui/shared-ui.module';
import { UploadComponent } from './services/upload/upload.component';


const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'media', component: UploadComponent },

    {
        path: 'agents' || 'users',
        loadChildren: () =>
            import('./components/agents/agents.module').then(
                m => m.AgentsModule
            ),
    },
    {
        path: 'api',
        loadChildren: () =>
            import('./components/api/api.module').then(m => m.ApiModule),
    },

    {
        path: 'users',
        loadChildren: () =>
            import('./components/agents/agents.module').then(
                m => m.AgentsModule
            ),
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
                m => m.ConstatsModule
            ),
    },
    {
        path: 'dailies',
        loadChildren: () =>
            import('./components/dailies/dailies.module').then(
                m => m.DailiesModule
            ),
    },
    {
        path: 'habitations',
        loadChildren: () =>
            import('./components/habitations/habitations.module').then(
                m => m.HabitationsModule
            ),
    },
    {
        path: 'horaires',
        loadChildren: () =>
            import('./components/horaires/horaires.module').then(
                m => m.HorairesModule
            ),
    },
    {
        path: 'infractions',
        loadChildren: () =>
            import('./components/infractions/infractions.module').then(
                m => m.InfractionsModule
            ),
    },
    {
        path: 'missions',
        loadChildren: () =>
            import('./components/missions/missions.module').then(
                m => m.MissionsModule
            ),
    },
    {
        path: 'quartiers',
        loadChildren: () =>
            import('./components/quartiers/quartiers.module').then(
                m => m.QuartiersModule
            ),
    },
    {
        path: 'rapports',
        loadChildren: () =>
            import('./components/rapports/rapports.module').then(
                m => m.RapportsModule
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
        path: 'rues',
        loadChildren: () =>
            import('./components/rues/rues.module').then(m => m.RuesModule),
    },
    {
        path: 'validations',
        loadChildren: () =>
            import('./components/validations/validations.module').then(
                m => m.ValidationsModule
            ),
    },
    {
        path: 'vehicules',
        loadChildren: () =>
            import('./components/vehicules/vehicules.module').then(
                m => m.VehiculesModule
            ),
    },
    {
        path: '**',
        loadChildren: () =>
            import('./components/not-found/not-found.module').then(
                m => m.NotFoundModule
            ),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        SharedUiModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
