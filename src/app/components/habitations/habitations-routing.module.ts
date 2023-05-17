import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitationsComponent } from './habitations.component';
import { DetailsHabitationComponent } from './details-habitation/details-habitation.component';

const routes: Routes = [
    { path: '', component: HabitationsComponent },
    { path: ':active', component: HabitationsComponent },
    { path: ':id', component: DetailsHabitationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HabitationsRoutingModule {}
