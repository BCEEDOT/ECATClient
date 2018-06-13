import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { Observable } from "rxjs";
import { pluck } from "rxjs/Operators";

import { StudentDataContext } from "../../../student/services/student-data-context.service";
import { FacultyDataContextService } from "../../../faculty/services/faculty-data-context.service";
import { IStudSpInventory, IFacSpInventory } from '../../../core/entities/client-models'
import { MpSpItemResponse, MpSpStatus } from '../../../core/common/mapStrings'
import { SpEffectLevel, SpFreqLevel } from '../../../core/common/mapEnum'
import { GlobalService } from "../../../core/services/global.service";

@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})

export class AssessComponent implements OnInit {
  inventories: Array<IStudSpInventory | IFacSpInventory>;
  inventories$: Observable<Array<IStudSpInventory | IFacSpInventory>>;
  isStudent: boolean;
  isSelf: boolean;
  perspective: string;
  activeInventory: IStudSpInventory | IFacSpInventory;
  canSave: boolean = false;
  respEnum = {
    he: SpEffectLevel.HighlyEffective,
    e: SpEffectLevel.Effective,
    ie: SpEffectLevel.Ineffective,
    usl: SpFreqLevel.Usually,
    alw: SpFreqLevel.Always
  };
  assessLoad: string = 'AssessLoading';
  viewOnly: boolean = true;

  constructor(private studentDataContext: StudentDataContext,
    private facultyDataContext: FacultyDataContextService,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

    this.inventories$ = route.data.pipe(pluck('inventories'));

  }

  ngOnInit() {
    this.inventories$.subscribe(invs => {
      this.inventories = invs;
      console.log(this.inventories);
      this.activate();
    }); 

  }

  activate(): void {
    //console.log(this.studentDataContext.getChanges());
    this.inventories.sort((a, b) => {
      if (a.displayOrder < b.displayOrder) { return -1; }
      if (a.displayOrder > b.displayOrder) { return 1; }
      return 0;
    });

    this.isStudent = this.global.persona.value.isStudent;
    console.log(this.inventories);
    this.isSelf = this.inventories[0].responseForAssessee.assessee.studentProfile.person.personId === this.global.persona.value.person.personId;

    if (this.isStudent) {
      if (this.isSelf) {
        this.perspective = 'were you';
      } else {
        this.perspective = 'was your peer';
      }
    } else {
      this.perspective = 'was your student';
    }

    this.activeInventory = this.inventories[0];

    if (this.isStudent) {
      this.viewOnly = this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.open;
    } else {
      //instructors can still add assessments when Under Review
      this.viewOnly = this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.open && this.activeInventory.responseForAssessee.workGroup.mpSpStatus !== MpSpStatus.underReview;
    }

  }

  onLeftArrow(event: Event) {
    this.previousInv();
  }

  onRightArrow(event: Event) {
    this.nextInv();
  }

  previousInv() {
    let prev = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder - 1));
    if (!prev) {
      let length = this.inventories.length;
      this.activeInventory = this.inventories[length - 1];
    } else {
      this.activeInventory = prev;
    }
    this.saveCheck();

  }

  nextInv() {
    let next = this.inventories.find(inv => inv.displayOrder === (this.activeInventory.displayOrder + 1));
    if (!next) {
      this.activeInventory = this.inventories[0];
    } else {
      this.activeInventory = next;
    }
    this.saveCheck();
  }

  saveCheck() {
    if (!this.viewOnly) {
      let changes = this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted());
      let validResps = this.inventories.every(inv => inv.responseForAssessee.mpItemResponse !== null);

      if (changes && validResps) {
        this.canSave = true;
      } else {
        this.canSave = false;
      }
    }
  }

  cancel() {

    if (!this.inventories.some(inv => inv.behaviorEffect !== null || inv.behaviorFreq !== null)) {
      this.inventories.forEach(inv => inv.rejectChanges());
      this.location.back();
    }


    if (this.inventories.some(inv => inv.responseForAssessee.entityAspect.entityState.isAddedModifiedOrDeleted())) {
      this.dialogService.openConfirm({
        message: 'Are you sure you want to cancel and discard your changes?',
        title: 'Unsaved Changed',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.inventories.forEach(inv => inv.rejectChanges());
          this.location.back();
        }
      });
    } else {
      console.log('')
      console.log(this.inventories);
      this.inventories.forEach(inv => {
        console.log(inv);
      });
      console.log(this.location);
      this.location.back();
    }
  }

  save() {
    if (this.viewOnly) {
      this.dialogService.openAlert({
        message: 'Group is not in open status',
        title: 'Cannot Save',
      });
      return;
    }

    this.loadingService.register();
    if (this.isStudent) {
      this.studentDataContext.commit()
        .then(result => {
          this.loadingService.resolve();
          this.global.showSnackBar('Success, Asessment Saved!');
          this.location.back();
        })
        .catch(error => {
          this.loadingService.resolve();
          this.dialogService.openAlert({
            message: error,
            title: 'Save Error',
          });
        })
    } else {
      this.facultyDataContext.commit()
        .then(result => {
          this.loadingService.resolve();
          this.global.showSnackBar('Success, Asessment Saved!');
          this.location.back();
        })
        .catch(error => {
          this.loadingService.resolve();
          this.dialogService.openAlert({
            message: error,
            title: 'Save Error',
          });
        })
    }
  }

  getResponseString(inv: IStudSpInventory | IFacSpInventory): string {
    switch (inv.responseForAssessee.mpItemResponse) {
      case MpSpItemResponse.iea:
        return 'Ineffective Always';
      case MpSpItemResponse.ieu:
        return 'Ineffective Usually';
      case MpSpItemResponse.nd:
        return 'Not Displayed';
      case MpSpItemResponse.eu:
        return 'Effective Usually';
      case MpSpItemResponse.ea:
        return 'Effective Always';
      case MpSpItemResponse.heu:
        return 'Highly Effective Usually';
      case MpSpItemResponse.hea:
        return 'Highly Effective Always';
      default:
        return '';
    }
  }

  getShortBehavior(inv: IStudSpInventory | IFacSpInventory): string {
    if (inv.behavior.length > 35) {
      return inv.behavior.substring(0, 32) + '...';
    } else {
      return inv.behavior;
    }
  }

}
