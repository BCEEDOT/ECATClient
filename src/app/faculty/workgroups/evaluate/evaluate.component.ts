import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from "@angular/material";
import { TdDialogService } from "@covalent/core";
import * as _ from "lodash";
import 'rxjs/add/operator/pluck';

import { WorkGroup, CrseStudentInGroup } from "../../../core/entities/faculty";
import { FacWorkgroupService } from "../../services/facworkgroup.service";
import { MpSpStatus } from "../../../core/common/mapStrings";
import { FacultyDataContextService } from "../../services/faculty-data-context.service";

@Component({
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {

  showComments: boolean = false;
  wgStatus: string = "tc-red-900";
  assessStatusIcon: string;
  stratStatusIcon: string;
  commentStatusIcon: string = 'lock';
  canReview: boolean = false;
  readOnly: boolean = false;
  members: CrseStudentInGroup[];
  workGroup: WorkGroup;
  workGroup$: Observable<WorkGroup>;
  workGroupId: number;
  paramWorkGroupId: number;
  paramCourseId: number;
  private wgName: string;
  private reviewBtnText: string = 'Review';
  private statusMap = MpSpStatus;

  assessComplete: boolean;
  stratComplete: boolean;
  commentsComplete: boolean;

  constructor(
    private route: ActivatedRoute,
    private facWorkGroupService: FacWorkgroupService,
    private location: Location,
    private dialogService: TdDialogService,
    private facultyDataContext: FacultyDataContextService,
    private snackBar: MdSnackBar
  ) {

    this.workGroup$ = route.data.pluck('workGroup');

    this.route.params.subscribe(params => {
      this.paramWorkGroupId = +params['wrkGrpId'];
      this.paramCourseId = +params['crsId'];

    });

  }

  ngOnInit() {
    this.workGroup$.subscribe(workGroup => {
      this.workGroup = workGroup;
      this.facWorkGroupService.facWorkGroup(this.workGroup);
      this.activate();
    });
    this.facWorkGroupService.assessComplete$.subscribe(ac => {
      this.assessComplete = ac;
      this.assessStatusIcon = (this.assessComplete) ? "check_box" : "indeterminate_check_box";
      this.canReviewCheck();
    });
    this.facWorkGroupService.stratComplete$.subscribe(sc => {
      this.stratComplete = sc;
      this.stratStatusIcon = (this.stratComplete) ? "check_box" : "indeterminate_check_box";
      this.canReviewCheck();
    });
    this.facWorkGroupService.commentsComplete$.subscribe(cc => {
      this.commentsComplete = cc;
      this.commentStatusIcon = (this.commentsComplete) ? "check_box" : "indeterminate_check_box";
      this.canReviewCheck();
    });

    this.facWorkGroupService.readOnly$.subscribe(status => {
      this.readOnly = status;
    })

    this.facWorkGroupService.onListView(false);

  }

  activate() {
    //this.facWorkGroupService.readOnly(false);
    this.workGroupId = this.workGroup.workGroupId;
    this.wgName = (this.workGroup.customName) ? `${this.workGroup.customName} [${this.workGroup.defaultName}]` : this.workGroup.defaultName;
    this.members = this.workGroup.groupMembers as CrseStudentInGroup[];

    this.members.sort((a: CrseStudentInGroup, b: CrseStudentInGroup) => {
      if (a.studentProfile.person.lastName > b.studentProfile.person.lastName) { return 1; }
      if (a.studentProfile.person.lastName < b.studentProfile.person.lastName) { return -1; }
      return 0;
    });

    let assessIncomplete = this.members.some(mem => {
      if (!mem.statusOfStudent.assessComplete) { return true; }
      return false;
    });
    this.facWorkGroupService.assessComplete(!assessIncomplete);

    let stratIncomplete = this.members.some(mem => {
      if (!mem.statusOfStudent.stratComplete) { return true; }
      return false;
    });
    this.facWorkGroupService.stratComplete(!stratIncomplete);

    switch (this.workGroup.mpSpStatus) {
      case MpSpStatus.created:
      case MpSpStatus.open:
        this.reviewBtnText = 'Review';
        this.canReview = this.workGroup.canPublish;
        break;
      case MpSpStatus.underReview:
        this.reviewBtnText = 'Complete';
        if (this.assessComplete && this.stratComplete) {
          this.canReview = true;
        } else {
          this.canReview = false;
        }
        this.showComments = true;

        let commentIncomplete = true;
        if (this.workGroup.spComments.length > 0) {
          commentIncomplete = this.workGroup.spComments.some(com => com.flag.mpFaculty === null);
        } else {
          commentIncomplete = true;
        }
        if (this.canReview) { this.canReview = !commentIncomplete; }
        this.facWorkGroupService.commentsComplete(!commentIncomplete);

        break;
      case MpSpStatus.reviewed:
        this.reviewBtnText = 'Re-review';
        this.canReview = true;
        this.showComments = true;
        this.facWorkGroupService.readOnly(true);
        break;
      case MpSpStatus.published:
        this.canReview = false;
        this.showComments = true;
        this.facWorkGroupService.readOnly(true);        
        break;
    }
  }

  canReviewCheck() {
    switch (this.workGroup.mpSpStatus) {
      case MpSpStatus.created:
      case MpSpStatus.open:
        this.canReview = this.workGroup.canPublish;
        break;
      case MpSpStatus.underReview:
        if (this.assessComplete && this.stratComplete && this.commentsComplete) {
          this.canReview = true;
        } else {
          this.canReview = false;
        }
        break;
      case MpSpStatus.reviewed:
        this.canReview = true;
        break;
      case MpSpStatus.published:
        this.canReview = false;
        break;
    }
  }

  reviewFlight() {
    let message: string;
    let title: string;

    if (!this.canReview) {
      switch (this.workGroup.mpSpStatus) {
        case MpSpStatus.created:
          message = 'Group has not yet been opened to students.'
          title = 'Cannot Review Group';
          break;
        case MpSpStatus.open:
          message = 'All students must have all assessments and strats complete. Check group status screen for more information.';
          title = 'Cannot Review Group';
          break;
        case MpSpStatus.underReview:
          message = 'You must complete and save all assessments and strats on all students and flag and save all comments before marking your review as complete.'
          title = 'Cannot Complete Review';
          break;
        case MpSpStatus.published:
          message = 'Group results have already been published.';
          title = 'Cannot Re-Review Group';
          break;
        default:
          message = 'Group status cannot be changed at this time.';
          title = 'Cannot Change Status';
      }

      this.dialogService.openAlert({
        message: message,
        title: title
      });

    } else {
      let setTo;
      let setReadOnly;
      switch (this.workGroup.mpSpStatus) {
        case MpSpStatus.open:
          message = 'Students will no longer be able to make changes to assessments/comments/strats. \n\n Are you sure you want to place this flight Under Review?';
          title = 'Review Group';
          setTo = MpSpStatus.underReview;
          break;
        case MpSpStatus.underReview:
          message = 'This will set the group as Reviewed and allow the ISA to Publish results. \n\n Are you sure you are done with your review?';
          title = 'Complete Review';
          setTo = MpSpStatus.reviewed;
          setReadOnly = true;
          break;
        case MpSpStatus.reviewed:
          message = 'This will set the group back to Under Review so you can change assessments/strats/comment flags. Are you sure you want to re-review?';
          title = 'Re-Review Group';
          setTo = MpSpStatus.underReview;
          setReadOnly = false;
          break;
      }

      this.dialogService.openConfirm({
        message: message,
        title: title,
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.workGroup.mpSpStatus = setTo;
          this.facWorkGroupService.readOnly(setReadOnly);
          this.facultyDataContext.commit().then(success => {
            this.snackBar.open('Group Status Updated!', 'Dismiss', {duration: 2000});
            this.activate();
          })
        }
      });
    }
  }

  //TODO: Remove this... for internal testing only
  publish() {
    this.dialogService.openConfirm({
      message: 'Are you sure you want to publish?',
      title: 'Publish Flight'
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed){
        this.workGroup.mpSpStatus = MpSpStatus.published;
        this.facultyDataContext.commit().then(success => {
          this.snackBar.open('Group Published', 'Dismiss', {duration: 2000});
          this.activate();
        })
      }
    })
  }
}
