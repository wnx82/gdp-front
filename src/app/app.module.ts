//app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
import { FileUploadModule } from 'primeng/fileupload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoaderComponent } from './main-page/loader/loader.component';
import { FooterComponent } from './main-page/footer/footer.component';
import { BodyComponent } from './main-page/body/body.component';
import { SidenavComponent } from './main-page/sidenav/sidenav.component';
import { SublevelMenuComponent } from './main-page/sidenav/sublevel-menu.component';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
import { NoOpenDirective } from './no-open.directive';
import { RegistrationComponent } from './services/registration/registration.component';
import { ToUpperCasePipe } from './services/toUpperCase/to-upper-case.pipe';
import { UploadComponent } from './services/upload/upload.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        LoaderComponent,
        FooterComponent,
        BodyComponent,
        SidenavComponent,
        SublevelMenuComponent,
        DashboardComponent,
        NoOpenDirective,
        RegistrationComponent,
        ToUpperCasePipe,
        UploadComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,
        LayoutModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyBootstrapModule,
        ButtonModule,
        PaginatorModule,
        InputTextModule,
        FileUploadModule,
        ToastModule,
    ],
    providers: [MessageService],
    bootstrap: [AppComponent],
})
export class AppModule {}
