
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/main-page/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from './services/shared-ui/shared-ui.module';
import { UploadComponent } from './services/upload/upload.component';
import { LoginComponent } from './components/interface/login/login.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MessageServiceComponent } from './components/user/message-service/message-service.component';
import { ForgotPasswordComponent } from './components/interface/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/interface/reset-password/reset-password.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },

    // { path: 'categories', component: CategoriesComponent },
    {
        path: '',
        // canActivate: [AuthGuard],
        component: MainPageComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'media', component: UploadComponent },
            { path: 'messages', component: MessageServiceComponent },
            {
                path: 'api',
                loadChildren: () =>
                    import('./components/administration/api/api.module').then(
                        m => m.ApiModule
                    ),
            },
            {
                path: 'agents',
                loadChildren: () =>
                    import('./components/administration/agents/agents.module').then(
                        m => m.AgentsModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./components/administration/agents/agents.module').then(
                        m => m.AgentsModule
                    ),
            },
            {
                path: 'articles',
                loadChildren: () =>
                    import('./components/administration/articles/articles.module').then(
                        m => m.ArticlesModule
                    ),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./components/administration/categories/categories.module').then(
                        m => m.CategoriesModule
                    ),
            },
            {
                path: 'constats',
                loadChildren: () =>
                    import('./components/administration/constats/constats.module').then(
                        m => m.ConstatsModule
                    ),
            },
            {
                path: 'dailies',
                loadChildren: () =>
                    import('./components/administration/dailies/dailies.module').then(
                        m => m.DailiesModule
                    ),
            },
            {
                path: 'habitations',
                loadChildren: () =>
                    import('./components/administration/habitations/habitations.module').then(
                        m => m.HabitationsModule
                    ),
            },
            {
                path: 'horaires',
                loadChildren: () =>
                    import('./components/administration/horaires/horaires.module').then(
                        m => m.HorairesModule
                    ),
            },
            {
                path: 'infractions',
                loadChildren: () =>
                    import('./components/administration/infractions/infractions.module').then(
                        m => m.InfractionsModule
                    ),
            },
            {
                path: 'missions',
                loadChildren: () =>
                    import('./components/administration/missions/missions.module').then(
                        m => m.MissionsModule
                    ),
            },
            {
                path: 'quartiers',
                loadChildren: () =>
                    import('./components/administration/quartiers/quartiers.module').then(
                        m => m.QuartiersModule
                    ),
            },
            {
                path: 'rapports',
                loadChildren: () =>
                    import('./components/administration/rapports/rapports.module').then(
                        m => m.RapportsModule
                    ),
            },
            {
                path: 'statistics',
                loadChildren: () =>
                    import('./components/statistiques/globalStats/globalStats.module').then(
                        m => m.globStatisticsModule
                    ),
            },
            {
                path: 'rues',
                loadChildren: () =>
                    import('./components/administration/rues/rues.module').then(m => m.RuesModule),
            },
            {
                path: 'validations',
                loadChildren: () =>
                    import('./components/administration/validations/validations.module').then(
                        m => m.ValidationsModule
                    ),
            },
            {
                path: 'vehicules',
                loadChildren: () =>
                    import('./components/administration/vehicules/vehicules.module').then(
                        m => m.VehiculesModule
                    ),
            },
        ],
    },
    {
        path: '**',
        loadChildren: () =>
            import('./components/interface/not-found/not-found.module').then(
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
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        // autres fournisseurs
      ],
})
export class AppRoutingModule {}
