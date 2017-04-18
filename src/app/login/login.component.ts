import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from "@angular/material";

import { TdLoadingService } from '@covalent/core';
import { AuthService } from "../core/services/auth.service";
import { AuthUtilityService } from "../core/services/auth-utility.service";

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
    private loadingService: TdLoadingService, private authService: AuthService, private snackBar: MdSnackBar, private authUtility: AuthUtilityService) { }

  ngOnInit() {
    var ecatAccessToken = localStorage.getItem('ecatAccessToken');

    //check if user has a stored token and it is still valid
    if (this.authUtility.validateToken(ecatAccessToken)) {
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
        //replace with correct message box
        alert('Login failed');
        this.loadingService.resolve();
      }
    }, (error: any) => {
      this.loadingService.resolve();
      this.snackBar.open(error, 'Close', { duration: 3000 });
      console.log(error);
    });
  }
}
