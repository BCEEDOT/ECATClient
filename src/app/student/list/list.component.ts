import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent } from "@angular/material";

import { TdLoadingService, TdDialogService } from '@covalent/core';

import { Course, WorkGroup, CrseStudentInGroup, SpInstrument, StratResponse } from '../../core/entities/student';
import { WorkGroupService } from '../services/workgroup.service';
import { GlobalService } from '../../core/services/global.service';
import { StudentDataContext } from '../services/student-data-context.service';
import { MpSpStatus } from '../../core/common/mapStrings';
import { Entity } from 'breeze-client';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  assessComplete: boolean = false;
  stratComplete: boolean = false;
  assessStatusIcon: string;
  stratStatusIcon: string;
  actionsAlignment: string;
  user: CrseStudentInGroup;
  instructions: string;
  activeWorkGroup: WorkGroup;
  activeWorkGroup$: Observable<WorkGroup>;
  paramWorkGroupId: number;
  paramCourseId: number;
  isLoading: boolean = false;
  readOnly: boolean = false;
  activeTab: number = 0;
  test: boolean = false;
  subs: Subscription[] = [];
  change: number = 1;


  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private studentDataContext: StudentDataContext, private router: Router,
    private route: ActivatedRoute, private dialogService: TdDialogService,

  ) {

    this.route.params.subscribe((params: any) => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });


  }

  ngOnInit(): void {
    console.log('It is in the ngONInit in list view of component');
    this.subs.push(this.workGroupService.workGroup$.subscribe((workGroup: WorkGroup) => {
      this.activeWorkGroup = workGroup;
      this.activate();
    }));

    this.subs.push(this.workGroupService.isLoading$.subscribe((value: boolean) => {
      this.isLoading = value;
    }));

    this.subs.push(this.workGroupService.assessComplete$.subscribe((ac: boolean) => {
      this.assessComplete = ac;
      this.assessStatusIcon = (this.assessComplete) ? 'check_circle' : 'error_outline';
    }));

    this.subs.push(this.workGroupService.stratComplete$.subscribe((sc: boolean) => {
      this.stratComplete = sc;
      this.stratStatusIcon = (this.stratComplete) ? 'check_circle' : 'error_outline';
    }));

  }

  ngOnDestroy(): void {
    console.log('It is in the ngONdestroy');
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  activate(force?: boolean): void {

    this.workGroupService.onListView(true);
    this.activeTab = 0;

    this.activeWorkGroup.groupMembers.sort((a: CrseStudentInGroup, b: CrseStudentInGroup) => {
      if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) { return -1; }
      if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) { return 1; }
      if (a.studentProfile.person.firstName > b.studentProfile.person.firstName) { return 1; }
      if (a.studentProfile.person.firstName < b.studentProfile.person.firstName) { return -1; }
      return 0;
    });

    const userId: number = this.global.persona.value.person.personId;
    this.user = this.activeWorkGroup.groupMembers.filter((gm: CrseStudentInGroup) => gm.studentId === userId)[0];
    this.user.updateStatusOfPeer();
    this.instructions = this.activeWorkGroup.assignedSpInstr.studentInstructions;
    this.readOnly = this.activeWorkGroup.mpSpStatus !== MpSpStatus.open;
    this.workGroupService.isLoading(false);

    let memberIds: string[] = Object.keys(this.user.statusOfPeer);

    let assessIncomplete: boolean = this.activeWorkGroup.groupMembers.some((mem: CrseStudentInGroup) => {
      let hasAssess: boolean = false;
      memberIds.forEach((id: string) => {
        if (!this.user.statusOfPeer[+id].assessComplete) { hasAssess = true; }
      });

      return hasAssess;

    });

    this.workGroupService.assessComplete(!assessIncomplete);

    let stratIncomplete: boolean = this.activeWorkGroup.groupMembers.some((mem: CrseStudentInGroup) => {
      let hasStrat: boolean = false;

      memberIds.forEach((id: string) => {
        if (!this.user.statusOfPeer[+id].stratComplete) { hasStrat = true; }
      });

      return hasStrat;
    });

    this.workGroupService.stratComplete(!stratIncomplete);
    // Change added to input property of child assess component to trigger change detection
    this.change++;

  }

  saveIAgree(): void {
    this.user.hasAcknowledged = true;
    this.studentDataContext.commit().then(() => {
      this.global.showSnackBar('Acknowledgement Saved!');
    }).catch((error) => this.global.showSnackBar('Error Saving Acknowledgement, please try again'));

  }

  changes(): void {
    console.log(this.studentDataContext.getChanges());
    console.log(this.workGroupService.stratTabActive$.value);
  }

  tabChanged(tabChanged: MatTabChangeEvent): void {
    console.log(tabChanged);
    console.log('Test');
    console.log(this.studentDataContext.getChanges());
    if (tabChanged.index === 1) {
      console.log('One the strat tab');
      this.workGroupService.stratTabActive(true);
    }

    if (tabChanged.index === 0 ) {
      console.log('On the assessment tab');
      this.workGroupService.stratTabActive(false);

      console.log(this.studentDataContext.getChanges());

      if (this.studentDataContext.hasChanges() && this.studentDataContext.getChanges().some((entity: StratResponse) => entity.stratPosition !== 0 )) {

        this.activeTab = 1;

        this.dialogService.openConfirm({
          message: 'Are you sure you want to leave this page?',
          title: 'Unsaved Changes',
          acceptButton: 'Yes',
          cancelButton: 'No'
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.studentDataContext.rollback();
            this.activeTab = 0;
            this.global.showSnackBar('Changes Discarded');
               
          } else {
            this.activeTab = 1;
          }
        });


      }

      if (this.studentDataContext.hasChanges() && this.studentDataContext.getChanges().every((entity: StratResponse) => entity.stratPosition === 0))
      {
        this.studentDataContext.rollback();
      }

    }
    

    
  }

}
