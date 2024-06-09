import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule} from './articles-routing.module'

import { ArticlesComponent } from './articles.component';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';


@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [CommonModule, ArticlesRoutingModule, SharedUiModule],

})
export class ArticlesModule { }
