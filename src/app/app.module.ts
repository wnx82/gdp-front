//app.module.ts
import { NgModule,LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { FormlyModule } from '@ngx-formly/core';
// import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoaderComponent } from './main-page/loader/loader.component';
import { FooterComponent } from './main-page/footer/footer.component';
import { BodyComponent } from './main-page/body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { DashboardModule } from './main-page/dashboard/dashboard.module';
import { NoOpenDirective } from './no-open.directive';
import { RegistrationComponent } from './services/registration/registration.component';
import { ToUpperCasePipe } from './services/toUpperCase/to-upper-case.pipe';
import { UploadComponent } from './services/upload/upload.component';
import { SharedUiModule } from './services/shared-ui/shared-ui.module';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageServiceComponent } from './components/message-service/message-service.component';
// import { StatisticsComponent } from './components/statistics/statistics.component';
import { PrimeNGConfig } from 'primeng/api';
import { PRIMENG_LOCALE_FR } from './services/primeNgLocal/primeNgLocal.service';



// import { ButtonModule } from 'primeng/button';
// import { PaginatorModule } from 'primeng/paginator';
// import { InputTextModule } from 'primeng/inputtext'; // Importez le module InputTextModule depuis primeng
// import { FileUploadModule } from 'primeng/fileupload';
// import { ToastModule } from 'primeng/toast';
@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        LoaderComponent,
        FooterComponent,
        BodyComponent,
        SidenavComponent,
        SublevelMenuComponent,
        
        NoOpenDirective,
        RegistrationComponent,
        ToUpperCasePipe,
        UploadComponent,
        MessageServiceComponent,
        
        // StatisticsComponent,

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,
        AppRoutingModule,
        DashboardModule,
        HttpClientModule,
        LayoutModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        // FormlyBootstrapModule,
        MessagesModule,
        SharedUiModule,
    ],
    // providers: [MessageService],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ],
    bootstrap: [AppComponent],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
    constructor(private primengConfig: PrimeNGConfig) {
        this.primengConfig.setTranslation(PRIMENG_LOCALE_FR);
      }
}
