import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitationsRoutingModule } from './habitations-routing.module';
import { HabitationsComponent } from './habitations.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

// import { DetailsHabitationComponent } from './details-habitation/details-habitation.component';

@NgModule({
    declarations: [HabitationsComponent],
    imports: [
        CommonModule,
        HabitationsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedUiModule,
    ],
})
export class HabitationsModule {}
