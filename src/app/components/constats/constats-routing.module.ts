import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstatsComponent } from './constats.component';
import { CreateConstatComponent } from './create-constat/create-constat.component';
import { EditConstatComponent } from './edit-constat/edit-constat.component';

const routes: Routes = [
    {
        path: '',
        component: ConstatsComponent,
    },
    {
        path: 'create',
        component: CreateConstatComponent,
    },
    {
        path: ':id',
        component: EditConstatComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConstatsRoutingModule {}
