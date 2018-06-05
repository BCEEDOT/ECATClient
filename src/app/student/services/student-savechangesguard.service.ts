import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { TdDialogService } from '@covalent/core';
import { Observable, Observer } from 'rxjs';

import { StudentComponent } from '../student.component';
import { StudentDataContext } from "./student-data-context.service";
import { StratResponse } from '../../core/entities/student';


@Injectable({
  providedIn: 'root'
})
export class StudentSavechangesguardService implements CanDeactivate<StudentComponent> {

  constructor(private studentDataContext: StudentDataContext, private dialogService: TdDialogService) { }

  canDeactivate(studentComponent: StudentComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): boolean {

    let changes = [];

    changes = this.studentDataContext.getChanges();

    if (changes.length === 0) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to leave this page?',
        title: 'Unsaved Changes',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.studentDataContext.rollback();
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });

  }
}
