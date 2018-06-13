import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output, OnDestroy } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { Subscription } from 'rxjs';
import { DragulaService } from "ng2-dragula";

import { Course, WorkGroup, CrseStudentInGroup, StratResponse } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"
import { SpProviderService } from "../../../provider/sp-provider/sp-provider.service";
import { StudentDataContext } from "../../services/student-data-context.service"
import { MpSpStatus } from "../../../core/common/mapStrings";

@Component({
  selector: 'strat',
  templateUrl: './strat.component.html',
  styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit, OnDestroy {//, OnChanges {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  unstratted: StratResponse[] = [];
  stratted: StratResponse[] = [];
  errorMessage: string;
  groupCount: number;
  userId: number;
  readOnly: boolean = false;
  showUnstrat: boolean = false;
  dragSub: Subscription;
  grpSub: Subscription;

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService,
    private spTools: SpProviderService, private dialogService: TdDialogService,
    private studentDataContext: StudentDataContext, private dragulaService: DragulaService) {

    //this.workGroupService.isLoading$.subscribe(value => this.isLoading = value);
  }

  //@Input() workGroup: WorkGroup;

  ngOnInit() {
    this.grpSub = this.workGroupService.workGroup$.subscribe(grp => {
      this.activeWorkGroup = grp;
      this.activate();
    });

  

  }

  ngOnDestroy() {
    this.grpSub.unsubscribe();
    this.dragSub.unsubscribe();
  }

  // ngOnChanges() {
  //   this.activate();
  // }

  activate() {

    this.activeWorkGroup = this.workGroupService.workGroup$.getValue();

    this.createStratEntities();

    this.unstratted = this.activeWorkGroup.spStratResponses.filter(str => {
      if (str.stratPosition === 0 && !str.entityAspect.entityState.isDetached()) { return true; }
    }).sort((a: StratResponse, b: StratResponse) => {
      if (a.assessee.studentProfile.person.lastName < b.assessee.studentProfile.person.lastName) { return -1; }
      if (a.assessee.studentProfile.person.lastName > b.assessee.studentProfile.person.lastName) { return 1; }
      if (a.assessee.studentProfile.person.firstName < b.assessee.studentProfile.person.firstName) { return -1; }
      if (a.assessee.studentProfile.person.firstName > b.assessee.studentProfile.person.firstName) { return 1; }
      return 0;
    });

    this.stratted = this.activeWorkGroup.spStratResponses.filter(str => {
      if (str.stratPosition !== 0 && !str.entityAspect.entityState.isDetached()) { return true; }
    }).sort((a: StratResponse, b: StratResponse) => {
      if (a.stratPosition < b.stratPosition) { return -1; }
      if (a.stratPosition > b.stratPosition) { return 1; }
      return 0;
    });

    if (this.unstratted.length > 0) {
      this.showUnstrat = true;
    } else {
      this.showUnstrat = false;
    }

    this.readOnly = this.activeWorkGroup.mpSpStatus !== MpSpStatus.open;
    this.groupCount = this.activeWorkGroup.groupMembers.length;
    this.userId = this.global.persona.value.person.personId;

    // this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];
    // this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);
    // this.evaluateStrat(true);
    this.dragSub = this.dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }

  private onDrop(args) {

    console.log(this.stratted);

    for (var i = 0; i < this.stratted.length; i++) {
      this.stratted[i].stratPosition = i + 1;

      //Fix for safari not repainting strat positions 
      //stopped working for some reason...
      // let sel = document.getElementById(this.stratted[i].assesseePersonId.toString());
      // sel.style.display = 'none';
      // sel.offsetHeight;
      // sel.style.display = '';

    }

    if (this.showUnstrat && this.unstratted.length === 0) {
      this.showUnstrat = false;
    }

  }

  createStratEntities(): void {
    this.activeWorkGroup.groupMembers.forEach(gm => {
      this.studentDataContext.getSingleStrat(gm.studentId, this.activeWorkGroup.workGroupId, this.activeWorkGroup.courseId);
    });
  }

  cancel() {
    //if (this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null)) {
    this.dialogService.openConfirm({
      message: 'Are you sure you want to cancel and discard your changes?',
      title: 'Unsaved Changed',
      acceptButton: 'Yes',
      cancelButton: 'No'
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadingService.register();
        this.unstratted = [];
        this.stratted = [];

        //having an issue where the detached entities are still being tracked with the group which is causing problems when canceling and refreshing everything...
        var notDetached = this.activeWorkGroup.spStratResponses.filter(str => {
          if (!str.entityAspect.entityState.isDetached()) { return true; }
        })
        notDetached.forEach(str => {
          str.entityAspect.rejectChanges();
        });

        this.createStratEntities();
        this.loadingService.resolve();
        this.activate();
        //this.activeWorkGroup.groupMembers.forEach(gm => {
        //gm.stratValidationErrors = [];
        //gm.stratIsValid = true;
        //gm.proposedStratPosition = undefined;
        //});
        this.global.showSnackBar("Changes Discarded");
        //this.location.back();
      }
    });
    //} else {
    //this.location.back();
    //}
  }

  isComplete(): boolean {
    return this.unstratted.length === 0;
  }

  isDirty(): boolean {
    if (this.stratted.length > 0) {
      return this.stratted.some(fstrat => fstrat.entityAspect.entityState.isAddedModifiedOrDeleted());
    }

    return false;
  }

  // isValid(): boolean {
  //   let invalidStrats = this.activeWorkGroup.groupMembers.some(gm => !gm.stratIsValid);
  //   let isDirty = this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null);

  //   if (!isDirty) {
  //     return true;
  //   }

  //   if (invalidStrats) {
  //     return true;
  //   }

  //   return false;

  // }

  // isPristine(): boolean {
  //   let stratComplete =  this.activeWorkGroup.groupMembers.some(gm => gm.proposedStratPosition !== null || gm.stratValidationErrors.length > 0);
  //   this.workGroupService.stratComplete(!stratComplete);
  //   return stratComplete
  // }

  // evaluateStrat(force?: boolean): void {
  //   this.spTools.evaluateStratification(false, force);
  // }

  saveChanges(): void {
    const that = this;
    this.loadingService.register();
    //this.evaluateStrat(true);

    //const hasErrors = this.activeWorkGroup.groupMembers
    //.some(gm => !gm.stratIsValid);

    // if (hasErrors) {
    //   this.dialogService.openAlert({
    //     message: 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving'
    //   })
    // }

    // const gmWithChanges = this.activeWorkGroup.groupMembers
    //   .filter(gm => gm.proposedStratPosition !== null);

    // const changeSet = [] as Array<number>;

    // gmWithChanges.forEach(gm => {
    //   //const stratResponse = gm.proposedStratPosition
    //   const stratResponse = this.studentDataContext.getSingleStrat(gm.studentId, this.workGroupService.workGroup$.value.workGroupId, gm.course.id);
    //   gm.assesseeStratResponse[0].stratPosition = gm.proposedStratPosition;
    //   changeSet.push(gm.studentId);
    // });


    this.spTools.save().then(() => {

      this.activeWorkGroup.groupMembers
        //.filter(gm => changeSet.some(cs => cs === gm.studentId))
        .forEach(gm => {
          gm.stratValidationErrors = [];
          gm.stratIsValid = true;
          gm.proposedStratPosition = null;
        });
      this.workGroupService.stratComplete(true);
      this.activeWorkGroup.groupMembers.filter(gm => { if (gm.studentId === this.userId) { return true; } })[0].updateStatusOfPeer();
      this.loadingService.resolve();
      this.activate();
      this.global.showSnackBar("Success, Strats Updated!");
    }).catch((error) => {
      this.activeWorkGroup.groupMembers.filter(gm => { if (gm.studentId === this.userId) { return true; } })[0].updateStatusOfPeer();
      this.loadingService.resolve();
      this.dialogService.openAlert({
        message: error,
        title: 'Save Error'
      })
    })

  }

}
