import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core';
// import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { GlobalService } from "../core/services/global.service";
import { AuthService } from '../core/services/auth.service';
// import { AuthUtilityService } from '../core/services/auth-utility.service';


@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  viewProviders: [AuthService]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router,
              private loadingService: TdLoadingService, 
              private authService: AuthService, 
              private global: GlobalService,
              ) { }

  ngOnInit(): void {

    // check if user has a stored token and it is still valid
    if (this.authService.tokenNotExpired()) {
      this.router.navigate(['/dashboard']);
    }

  }

  login(): void {

    this.loadingService.register();
    this.authService.login(this.username, this.password).subscribe(result => {
      if (result === true) {
        this.loadingService.resolve();
        this.router.navigate(['/dashboard']);
      } else {
        // replace with correct message box
        alert('Login failed');
        this.loadingService.resolve();
      }
    }, (error: any) => {
      this.loadingService.resolve();
      this.global.showSnackBar(error);
      console.log(error);
    });
  }
}
