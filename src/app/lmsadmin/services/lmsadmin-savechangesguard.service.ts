import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from "@angular/router";
import { TdDialogService } from "@covalent/core";
import { Observable, Observer } from "rxjs";

import { LmsadminComponent } from "../lmsadmin.component";
import { LmsadminDataContextService } from "./lmsadmin-data-context.service";

@Injectable()
export class LmsadminSavechangesguardService
  implements CanDeactivate<LmsadminComponent> {

  constructor(
    private dialogService: TdDialogService,
    private lmsAdminDataContext: LmsadminDataContextService
  ) {}

  canDeactivate(
    lmsadminComponent: LmsadminComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): boolean {

    if (!this.lmsAdminDataContext.hasChanges()) {
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
          this.lmsAdminDataContext.rollback();
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
