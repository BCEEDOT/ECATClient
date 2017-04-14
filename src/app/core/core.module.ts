import {
    ModuleWithProviders, NgModule,
    Optional, SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmProviderService } from './services/em-provider.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AuthUtilityService } from './services/auth-utility.service';
import { JwtHelper } from "angular2-jwt";
import { EntityUserModule } from "./entities/ecat/user-entity.module";

// ATTENTION: Never import this module into a lazy loaded module. Only import into app module.
@NgModule({
    imports: [
        CommonModule,
        EntityUserModule
    ],
    declarations: [],
    exports: [],
    providers: [
        EmProviderService,
        AuthGuard,
        AuthService,
        AuthUtilityService,
        JwtHelper
    ]
})

export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}