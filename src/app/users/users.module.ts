import { NgModule } from "@angular/core";

import { UsersComponent } from "./users.component";

import { UsersService} from "./services/users.service";
import { SharedModule } from "../shared/shared.module";

import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
    imports: [
        UsersRoutingModule,
        SharedModule
    ],
    declarations: [
        UsersComponent
    ],
    exports: [],
    providers: [UsersService]
})

export class UsersModule { }