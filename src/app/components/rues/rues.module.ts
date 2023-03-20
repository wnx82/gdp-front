import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuesRoutingModule } from './rues-routing.module';
import { RuesComponent } from './rues.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
@NgModule({
    declarations: [RuesComponent],
    imports: [CommonModule, RuesRoutingModule, FormsModule, ButtonModule],
})
export class RuesModule {}
