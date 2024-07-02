import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitationUsersComponent } from './habitation-users.component';
import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
import { HabitationsUsersRoutingModule } from './habitations-users-routing.module';

@NgModule({
    declarations: [HabitationUsersComponent],
    imports: [CommonModule, HabitationsUsersRoutingModule, SharedUiModule],
})
export class HabitationUsersModule {}
