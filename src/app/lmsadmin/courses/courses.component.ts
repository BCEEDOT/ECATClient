import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TdDialogService, TdLoadingService } from "@covalent/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Observable } from "rxjs";
import { pluck } from "rxjs/Operators";

import { PollLmsDialog } from "./poll-lms-dialog/poll-lms-dialog.component";
import { Course } from "../../core/entities/lmsadmin";
import { LmsadminDataContextService } from "../services/lmsadmin-data-context.service";
import { GlobalService } from "../../core/services/global.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Array<Course>>;
  courses: Array<Course>;
  isLoading: boolean = false;
  dialogRef: MatDialogRef<PollLmsDialog>;

  constructor(private ctx: LmsadminDataContextService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: TdDialogService,
    private loadingService: TdLoadingService) {
      this.courses$ = route.data.pipe(pluck('courses'));
    }

  ngOnInit() {
    this.courses$.subscribe(c => {
      this.courses = c;
      this.activate();
    })
  }

  activate(){
    if (this.courses){
      //sort descending
      this.courses.sort((a: Course, b: Course) => {
        if (a.startDate < b.startDate) {return 1}
        if (a.startDate > b.startDate) {return -1}
        if (a.gradDate < b.gradDate) {return 1}
        if (a.gradDate > b.gradDate) {return -1}
        return 0
      })
      
      this.courses.forEach(course => {
        course['displayStart'] = course.startDate.toDateString();
        course['displayGrad'] = course.gradDate.toDateString();
      })
    }
  }
    
  refreshData() {
    this.ctx.fetchAllCourses(true).then(data => {
      this.courses = data;
      this.activate();
    })
  }

  pollCourses() {
    this.loadingService.register();
    this.ctx.pollCourses().then(data => {
      this.loadingService.resolve();
      this.courses = this.ctx.cachedCourses();
      
      this.dialogService.openAlert({
        message: 'Courses Added: ' + data.numAdded,
        title: 'Poll Complete',
        closeButton: 'Dismiss'
      });

      this.activate();
    }).catch((e: Event) => {
      this.loadingService.resolve();
      console.log('Error retrieving courses ' + e);
      this.dialogService.openAlert({
        message: 'Error polling LMS for courses. Please try again.',
        title: 'Poll Error',
        closeButton: 'Dismiss'
      });
    });
  }

  pollCanvasCourses(){
    this.loadingService.register();
    this.ctx.pollCanvasCourses().then(reconResult => {
      this.loadingService.resolve();
      
      if (reconResult.hasToken){
        this.courses = this.ctx.cachedCourses();
        
        this.dialogService.openAlert({
          message: 'Courses Added: ' + reconResult.numAdded,
          title: 'Poll Complete',
          closeButton: 'Dismiss'
        });
  
        this.activate();
      } else {
        this.dialogService.openConfirm({
          message: 'ECAT does not have a valid LMS token for your account. Please authorize with the LMS so ECAT can generate a token.',
          title: 'Missing LMS Token',
          acceptButton: 'Authorize'
        }).afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed){
            window.open(this.ctx.canvasAuthUrl, '_blank');
          }
        })
      }
    }).catch((e: Event) => {
      this.loadingService.resolve();
      this.dialogService.openAlert({
        message: 'There was a problem Polling Courses. Please try again.',
        title: 'Poll Error',
        closeButton: 'Dismiss'
      });
    }); 
  }

  pollLmsCourseDetails(courseId) {
    this.dialog.open(PollLmsDialog, {
      disableClose: true,
      data: {
        courseId: courseId,
      }
    }).afterClosed().subscribe(() => {this.activate()});
  }

}
