import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { TdDialogService } from "@covalent/core";

import { Course } from "../../../core/entities/faculty";
import { LmsadminDataContextService } from "../../services/lmsadmin-data-context.service";

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {
  course: Course;

  constructor(private lmsadminDataContextService: LmsadminDataContextService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: TdDialogService,
    private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let courseId: number = +params['crsId'];
      this.lmsadminDataContextService.fetchAllCourses().then((courses: Array<Course>) => {
        this.course = courses.filter(course => course.id === courseId)[0];
      });
    })
  }

  cancel(){
    if (this.course.entityAspect.entityState.isModified()){
      this.dialogService.openConfirm({
        message: 'You have unsaved changes, are you sure you want to cancel them?',
        title: 'Cancel',
        acceptButton: 'Yes',
        cancelButton: 'No'
      }).afterClosed().subscribe((confirmed: boolean) => {
        if(confirmed){
          this.course.entityAspect.rejectChanges();
          this.router.navigate(['../../'], { relativeTo: this.route });
        }
      });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  save(){
    if (this.course.entityAspect.entityState.isModified()) {
      this.lmsadminDataContextService.commit().then(fulfilled => {
      this.snackBar.open('Course Info Saved!', 'Dismiss', {duration: 2000});
      this.router.navigate(['../../'], { relativeTo: this.route });
    }, (reject => {
      this.dialogService.openAlert({message: 'There was a problem saving, please try again.', title: 'Save Error'});
    }));
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

}
