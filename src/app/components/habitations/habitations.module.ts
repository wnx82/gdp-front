import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitationsRoutingModule } from './habitations-routing.module';
import { HabitationsComponent } from './habitations.component';

import { SharedUiModule } from 'src/app/services/shared-ui/shared-ui.module';

// import { DetailsHabitationComponent } from './details-habitation/details-habitation.component';

@NgModule({
    declarations: [HabitationsComponent],
    imports: [CommonModule, HabitationsRoutingModule, SharedUiModule],
})
export class HabitationsModule {}
