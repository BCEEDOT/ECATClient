import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subject ,  BehaviorSubject, timer } from 'rxjs';
import { TdDialogService } from "@covalent/core";

import { Person } from "../entities/user";


export interface ILoggedInUser {
  person: Person,
  isLoggedIn: boolean,
  isStudent: boolean,
  isFaculty: boolean,
  isLmsAdmin: boolean,
}

@Injectable()
export class GlobalService {

  userDataContextActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  persona: BehaviorSubject<ILoggedInUser> = new BehaviorSubject({} as ILoggedInUser);

  constructor(private dialogService: TdDialogService, private snackBar: MatSnackBar) {}

  user(user: ILoggedInUser) {
    this.persona.next(user);
  }

  userDataContext(activated) {
    this.userDataContextActivated.next(activated);
  }

  showSnackBar(text: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'left';
    config.duration = 2000;

    this.snackBar.open(text,'', config);

  }

  startTokenTimer(time: number){
    if (time < 0) {
      this.dialogService.openAlert({message: 'Your login token expires in less than 5 minutes. Please save your work and close and relaunch ECAT to receive a new token.', title: 'Token Expiration', closeButton: 'Ok'});
    } else {
      let time1 = timer(time);
      time1.subscribe(_ => {
        this.dialogService.openAlert({message: 'Your login token will expire in 5 minutes. Please save your work and close and relaunch ECAT to receive a new token.', title: 'Token Expiration', closeButton: 'Ok'})
      });
    }
  }

}
