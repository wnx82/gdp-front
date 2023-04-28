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
    { path: 'media', component: UploadComponent },
    // {
    //     path: 'media',
    //     loadChildren: () =>
    //         import('./components/media/media.module').then(m => m.MediaModule),
    // },
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
        path: 'quartiers',
        loadChildren: () =>
            import('./components/quartiers/quartiers.module').then(
                m => m.QuartiersModule
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
        path: 'app',
        loadChildren: () =>
            import(
                './components/habitations/details-habitation/details-habitation.module'
            ).then(m => m.DetailsHabitationModule),
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
