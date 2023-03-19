import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenubarModule } from 'primeng/menubar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainPageComponent } from './main-page/main-page.component';
import { LoaderComponent } from './main-page/loader/loader.component';

@NgModule({
  declarations: [AppComponent, MainPageComponent, LoaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
