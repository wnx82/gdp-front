import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitationUsersComponent } from './habitation-users.component';

const routes: Routes = [
    { path: '', component: HabitationUsersComponent },
    { path: ':active', component: HabitationUsersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HabitationsUsersRoutingModule {}
