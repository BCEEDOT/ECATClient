import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route,
} from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
// import { AuthUtilityService } from '../../core/services/auth-utility.service';
import { EmProviderService } from '../../core/services/em-provider.service';
import { FacultyRegistrationHelper } from '../../core/entities/faculty';
import { DataContext, ResourceEndPoint } from '../../app-constants';
import { GlobalService, ILoggedInUser } from '../../core/services/global.service';

@Injectable()
export class FacultyAuthGuardService implements CanActivate, CanActivateChild {

  facultyContextActivated = false;
  persona: ILoggedInUser;

  constructor(private authService: AuthService,
    private router: Router,
    private emProvider: EmProviderService, private regHelper: FacultyRegistrationHelper,
    // private jwt: JwtHelperService,
    private global: GlobalService) {

    this.global.persona.subscribe((data) => {
      this.persona = data;
    });

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    // First check if a user has a token and if it is expired


    if (this.authService.tokenNotExpired() && this.facultyContextActivated && this.persona.isFaculty) {

      return true;

    } else if (this.persona.isFaculty) {

      return this.activate(url);

    } else {
      this.router.navigate(['/dashboard']);
      console.log('Your are not a faculty');
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  activate(url: string): boolean {
    // TODO: Rewrite this to handle errors better
    // check if user has a stored token
    if (this.authService.tokenNotExpired()) {
      return <any>this.emProvider.prepare(DataContext.Faculty, this.regHelper, ResourceEndPoint.Faculty)
        .then(() => {
          console.log('Faculty Context Activated');
          this.facultyContextActivated = true;
          return true;
        })
        .catch(e => {
          console.log('Error creating user em' + e);
          if (e.status === 401) {
            this.router.navigate(['/login']);
            return false;
          }
        })

    }

    // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // // Create a dummy session id
    // let sessionId = 123456789;

    // // Set our navigation extras object
    // // that contains our global query params and fragment
    // let navigationExtras: NavigationExtras = {
    //   queryParams: { 'session_id': sessionId },
    //   fragment: 'anchor'
    // };

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

}
