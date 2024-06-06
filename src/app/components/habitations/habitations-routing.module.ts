import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitationsComponent } from './habitations.component';


const routes: Routes = [
    { path: '', component: HabitationsComponent },
    { path: ':active', component: HabitationsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HabitationsRoutingModule {}
