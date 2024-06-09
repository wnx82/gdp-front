import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [CategoriesComponent],
    imports: [CommonModule,CategoriesRoutingModule,SharedUiModule, ],
})
export class CategoriesModule {}
