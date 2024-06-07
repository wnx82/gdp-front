import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from './services/shared-ui/shared-ui.module';
import { UploadComponent } from './services/upload/upload.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { MainPageComponent } from './main-page/main-page.component';
import { MessageServiceComponent } from './components/message-service/message-service.component';
const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'password', component: PasswordComponent },

    {
        path: '',
        canActivate: [AuthGuard],
        component: MainPageComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'media', component: UploadComponent },
            { path: 'messages', component: MessageServiceComponent },
            {
                path: 'api',
                loadChildren: () =>
                    import('./components/api/api.module').then(
                        m => m.ApiModule
                    ),
            },
            {
                path: 'agents',
                loadChildren: () =>
                    import('./components/admin/agents/agents.module').then(
                        m => m.AgentsModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./components/admin/agents/agents.module').then(
                        m => m.AgentsModule
                    ),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./components/admin/categories/categories.module').then(
                        m => m.CategoriesModule
                    ),
            },
            {
                path: 'constats',
                loadChildren: () =>
                    import('./components/admin/constats/constats.module').then(
                        m => m.ConstatsModule
                    ),
            },
            {
                path: 'dailies',
                loadChildren: () =>
                    import('./components/admin/dailies/dailies.module').then(
                        m => m.DailiesModule
                    ),
            },
            {
                path: 'habitations',
                loadChildren: () =>
                    import('./components/admin/habitations/habitations.module').then(
                        m => m.HabitationsModule
                    ),
            },
            {
                path: 'horaires',
                loadChildren: () =>
                    import('./components/admin/horaires/horaires.module').then(
                        m => m.HorairesModule
                    ),
            },
            {
                path: 'infractions',
                loadChildren: () =>
                    import('./components/admin/infractions/infractions.module').then(
                        m => m.InfractionsModule
                    ),
            },
            {
                path: 'missions',
                loadChildren: () =>
                    import('./components/admin/missions/missions.module').then(
                        m => m.MissionsModule
                    ),
            },
            {
                path: 'quartiers',
                loadChildren: () =>
                    import('./components/admin/quartiers/quartiers.module').then(
                        m => m.QuartiersModule
                    ),
            },
            {
                path: 'rapports',
                loadChildren: () =>
                    import('./components/admin/rapports/rapports.module').then(
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
                    import('./components/admin/rues/rues.module').then(m => m.RuesModule),
            },
            {
                path: 'validations',
                loadChildren: () =>
                    import('./components/admin/validations/validations.module').then(
                        m => m.ValidationsModule
                    ),
            },
            {
                path: 'vehicules',
                loadChildren: () =>
                    import('./components/admin/vehicules/vehicules.module').then(
                        m => m.VehiculesModule
                    ),
            },
        ],
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
