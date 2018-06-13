import { Injectable } from '@angular/core';
// import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/common/http';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from "rxjs/Operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { EntityState } from 'breeze-client';



// import { AuthUtilityService } from "./auth-utility.service";
import { environment } from "../../../environments/environment";
import { Person } from "../entities/user";
import { GlobalService, ILoggedInUser } from "./global.service";
import { EmProviderService } from "./em-provider.service";
import { DataContext } from "../../app-constants";
import { MpEntityType, MpInstituteRole } from "../common/mapStrings";
import { TdDialogService } from '@covalent/core';

interface ILoginResponse {
  access_token: string;
  id_token: string;
}

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  // public token: string;

  constructor(private http: HttpClient, private router: Router, private global: GlobalService,
    private jwt: JwtHelperService, private emProvider: EmProviderService, private dialogService: TdDialogService) { }

  login(username: string, password: string): Observable<boolean> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
     const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    // TODO: Update for environment
    // dev
    // return this.http.post<ILoginResponse>('http://localhost:62187/connect/token', body,
    return this.http.post<ILoginResponse>(environment.api_url + 'connect/token', body,
      // awstesting
      // return this.http.post('http://ec2-34-237-207-101.compute-1.amazonaws.com/connect/token',
      { headers: headers }).pipe(map((loginResponse: ILoginResponse) => {
        console.log(loginResponse);
        let accessToken = loginResponse.access_token;
        let idToken = loginResponse.id_token;
        if (accessToken && idToken) {
          localStorage.setItem('ecatAccessToken', accessToken);
          localStorage.setItem('ecatUserIdToken', idToken);
          return true;
        } else {

          return false;
        }
      }));
  }

  activateUser(): void {

    let accessTokenSigned = localStorage.getItem('ecatAccessToken');
    let idTokenSigned = localStorage.getItem('ecatUserIdToken');

    let accessToken = this.jwt.decodeToken(accessTokenSigned);
    //TODO: .NET CORE
    //let idToken = this.jwt.decodeToken(idTokenSigned);
    let idToken = JSON.parse(idTokenSigned);

    var user: ILoggedInUser = <ILoggedInUser>{};

    var loggedInUser = {
      //TODO: .NET CORE
      //personId: accessToken.sub,
      personId: accessToken.primarysid,
      lastName: idToken.lastName,
      firstName: idToken.firstName,
      isActive: true,
      mpGender: idToken.mpGender,
      mpAffiliation: idToken.mpAffiliation,
      mpPaygrade: idToken.mpPaygrade,
      mpComponent: idToken.mpComponent,
      email: idToken.email,
      registrationComplete: idToken.registrationComplete,
      mpInstituteRole: idToken.mpInstituteRole,
    } as Person;

    console.log(loggedInUser);

    let entityUser = this.emProvider.getManager(DataContext.User).createEntity(MpEntityType.person, loggedInUser, EntityState.Unchanged);
    user.person = entityUser as Person;

    if (loggedInUser.mpInstituteRole === MpInstituteRole.student) {
      user.isFaculty = false;
      user.isStudent = true;
      user.isLmsAdmin = false;
    }

    if (loggedInUser.mpInstituteRole === MpInstituteRole.faculty) {
      user.isFaculty = true;
      user.isStudent = false;
      user.isLmsAdmin = accessToken.role.some(role => role === 'ISA');
    }

    this.global.user(user);
    console.log(user);

    // set a timer for warning the user when they are 5 minutes from token expiring
    // token.exp is in seconds, Date.now in milliseconds, and tokenTimer wants milliseconds
    let tokenWarn = ((accessToken.exp - (Date.now() / 1000)) - 300) * 1000;
    this.global.startTokenTimer(tokenWarn);
  }

  logout(): void {

    if (this.emProvider) {
      this.emProvider.clear(DataContext.User);
      this.emProvider.clear(DataContext.Student);
      this.emProvider.clear(DataContext.Faculty);
      this.emProvider.clear(DataContext.LmsAdmin);
    }

    this.global.user(undefined);
    this.global.userDataContext(false);
    localStorage.removeItem('ecatAccessToken');
    localStorage.removeItem('ecatUserIdToken');
    this.router.navigate(['/login']);
  }

  tokenNotExpired(): boolean {
    const token = this.jwt.tokenGetter();

    return token !== null && !this.jwt.isTokenExpired(token);
  }

}