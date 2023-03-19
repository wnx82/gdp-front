import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { MenubarModule } from 'primeng/menubar';
@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, MainPageRoutingModule, MenubarModule],
})
export class MainPageModule {}
