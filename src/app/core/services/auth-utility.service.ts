import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { GlobalService } from "./global.service";
import { Person } from "../entities/user";
import { IdToken, IPerson } from "../entities/client-entities";
import { EmProviderService } from "./em-provider.service";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp, EntityState, MergeStrategy } from "breeze-client";
import {
    Router,
    Route
} from '@angular/router';



@Injectable()
export class AuthUtilityService {

    ecatUserIdToken: any;
    ecatAccessToken: any;
    em: EntityManager;

    constructor(private jwtHelper: JwtHelper, private global: GlobalService, private emProviderService: EmProviderService, private router: Router) { }

    public validateToken(ecatAccessToken: any): boolean {

        if (!ecatAccessToken) { console.log('Token does not exist'); return false };

        if (this.jwtHelper.isTokenExpired(ecatAccessToken)) { console.log('Token has expired'); return false; }

        return true;
    }

    public login(ecatUserIdToken: any, ecatAccessToken: any): boolean {

        if (!ecatUserIdToken && !ecatAccessToken) { return false; }

        this.ecatUserIdToken = this.jwtHelper.decodeToken(ecatUserIdToken) as IdToken;
        this.ecatAccessToken = this.jwtHelper.decodeToken(ecatAccessToken);

        var em = this.emProviderService.getManager();

        var loggedInUser = {
            personId: this.ecatAccessToken.sub,
            lastName: this.ecatUserIdToken.LastName,
            firstName: this.ecatUserIdToken.FirstName,
            isActive: true,
            mpGender: this.ecatUserIdToken.MpGender,
            mpAffiliation: this.ecatUserIdToken.MpAffiliation,
            mpPaygrade: this.ecatUserIdToken.MpPaygrade,
            mpComponent: this.ecatUserIdToken.MpComponent,
            email: this.ecatUserIdToken.Email,
            registrationComplete: true,
            mpInstituteRole: this.ecatUserIdToken.MpInstituteRole
        } as Person;

        
        var user = em.createEntity("Person", loggedInUser, EntityState.Unchanged, MergeStrategy.PreserveChanges) as IPerson;
        this.global.user(user);
        return true;

    }

    public logout() {
        localStorage.removeItem('ecatAccessToken');
        localStorage.removeItem('ecatUserIdToken');
        this.router.navigate(['/login']);
    }



}