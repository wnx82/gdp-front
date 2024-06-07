import { NgModule } from '@angular/core';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';

@NgModule({
    declarations: [CategoriesComponent],
    imports: [SharedUiModule, CategoriesRoutingModule],
})
export class CategoriesModule {}
