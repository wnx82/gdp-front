import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { SharedUiModule } from '../../../services/shared-ui/shared-ui.module';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
    declarations: [UsersComponent, ],
    imports: [SharedUiModule, UsersRoutingModule],
})
export class UsersModule {}
