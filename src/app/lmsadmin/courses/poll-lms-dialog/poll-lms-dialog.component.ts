import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { TdLoadingService, TdDialogService } from "@covalent/core";

import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";
import { GroupReconResult, MemReconResult, GroupMemReconResult, CourseDetailsReconResult } from "../../../core/entities/lmsadmin";

@Component({
  selector: 'app-poll-lms-dialog',
  templateUrl: './poll-lms-dialog.component.html',
  styleUrls: ['./poll-lms-dialog.component.scss']
})
export class PollLmsDialog implements OnInit {
  courseId: number;
  enrollResult: MemReconResult;
  groupsResult: GroupReconResult;
  grpMemResults: Array<GroupMemReconResult> = [];
  courseDetailsReconResults: CourseDetailsReconResult;
  enrollComplete: boolean = false;
  groupsComplete: boolean = false;
  grpMemsComplete: boolean = false;
  pollComplete: boolean = false;
  pollFail: boolean = false;
  failMessage: string;

  constructor(private lmsAdminDataCtx: LmsadminDataContextService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService, 
    private dialogRef: MatDialogRef<PollLmsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.courseId = this.data.courseId;
    //this.pollCourseEnrolls();
    this.pollCanvasEnrollments();
  }

  pollCanvasEnrollments() {
    this.lmsAdminDataCtx.pollCanvasCourseDetails(this.courseId).then(data => {
      if (data.hasToken) {
        this.groupsResult = data.groupReconResult;
        this.enrollResult = data.courseMemberReconResult;
        this.grpMemResults = data.groupMemReconResults.filter(gmrr => gmrr.numAdded > 0 || gmrr.numRemoved > 0);
        //this.enrollResult = data;
        this.pollComplete = true;
        //this.pollCanvasSections();
      } else {
        this.dialogService.openConfirm({
          message: 'ECAT does not have a valid LMS token for your account. Please authorize with the LMS so ECAT can generate a token.',
          title: 'Poll Failed.',
          acceptButton: 'Authorize'
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed){
            window.open(this.lmsAdminDataCtx.canvasAuthUrl, '_blank');
          }
        })
      }
    }).catch((e: Event) => {
      console.log('Error retrieving course enrollments ' + e);
      this.pollFail = true;
      this.dialogService.openAlert({
        message: 'Error polling LMS for enrollments. Please try again.',
        title: 'Poll Error',
        closeButton: 'Dismiss'
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  // pollCanvasSections(){
  //   this.lmsAdminDataCtx.pollCanvasSections(this.courseId)
  //   .then(resp => {
  //     if (resp.hasToken) {
  //       this.groupsResult = resp;
  //       this.groupsComplete = true;
  //       this.pollCanvasSectionMems();
  //     }
  //     else {
  //       this.dialogService.openConfirm({
  //         message: 'ECAT does not have a valid LMS token for your account. Please authorize with the LMS so ECAT can generate a token.',
  //         title: 'Poll Failed.',
  //         acceptButton: 'Authorize'
  //       }).afterClosed().subscribe((confirmed: boolean) => {
  //         if (confirmed){
  //           window.open(this.lmsAdminDataCtx.canvasAuthUrl, '_blank');
  //         }
  //       })
  //     }
  //   })
  //   .catch((e: Event) => {
  //     console.log('Error retrieving groups ' + e);
  //     this.pollFail = true;
  //     this.failMessage = "Error retrieving groups. Please try again.";
  //   });
  // }

  // pollCanvasSectionMems(){
  //   this.lmsAdminDataCtx.pollCanvasSectionMembers(this.courseId)
  //   .then(GroupMemReconResults => {
  //     if (GroupMemReconResults.every(results => results.hasToken == true)) {
  //       //For some reason groups with no additions or removals are getting returned
  //       var cleanResult: GroupMemReconResult[] = [];
  //       GroupMemReconResults.forEach(result => {
  //         if (result.numAdded > 0 || result.numRemoved > 0){
  //           cleanResult.push(result);
  //         }
  //       });
  //       this.grpMemResults = cleanResult;
  //       this.grpMemsComplete = true;
  //       this.pollComplete = true;
  //     }
  //     else {
  //       this.dialogService.openConfirm({
  //         message: 'ECAT does not have a valid LMS token for your account. Please authorize with the LMS so ECAT can generate a token.',
  //         title: 'Poll Failed.',
  //         acceptButton: 'Authorize'
  //       }).afterClosed().subscribe((confirmed: boolean) => {
  //         if (confirmed){
  //           window.open(this.lmsAdminDataCtx.canvasAuthUrl, '_blank');
  //         }
  //       })
  //     }
  //   })
  //   .catch((e) => {
  //     console.log('Error retrieving group memberships ' + e);
  //     this.pollFail = true;
  //     this.failMessage = "Error retrieving group memberships. Please try again.";
  //   });
  // }
}
