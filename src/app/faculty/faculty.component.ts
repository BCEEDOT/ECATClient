import { Component, AfterViewInit, OnInit, Inject, OnDestroy, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable ,  Subscription } from 'rxjs';
import { pluck, filter, pairwise } from "rxjs/Operators";
import { TdDialogService, TdLoadingService } from "@covalent/core";

import { Course, WorkGroup } from '../core/entities/faculty';
import { FacultyDataContextService } from './services/faculty-data-context.service';
import { FacWorkgroupService } from "./services/facworkgroup.service";

@Component({
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit, AfterContentChecked {

  courses$: Observable<Course[]>;
  courses: Course[];
  activeCourse: Course;
  activeCourseId: number;
 //onListView: boolean = true;
  onListView$: Observable<boolean>;
  viewSub: Subscription;

  constructor(private titleService: Title,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private facultyDataContext: FacultyDataContextService,
    private facWorkGroupService: FacWorkgroupService,
  ) {

    // router.events
    //   .pipe(
    //     filter(e => e instanceof NavigationEnd),
    //     pairwise()
    //   )

    //   .subscribe((event: any[]) => {
    //     var previousRoute = event[0].urlAfterRedirects;
    //     var newRoute = event[1].urlAfterRedirects;

    //     console.log(previousRoute);
    //     console.log(newRoute);

    //     // var matchPreviousRoute = previousRoute.match("list|result");
    //     // var matchNewRoute = newRoute.match("^/student/assessment$");

    //     // if (matchPreviousRoute && matchNewRoute) {
    //     //   this.activate(false);
    //     // }
    //   });

    this.courses$ = route.data.pipe(pluck('courses'));
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.courses$.subscribe((courses: Course[]) => {
      this.courses = courses;
      this.activate();
    });

    this.onListView$ = this.facWorkGroupService.onListView$.asObservable();

    // this.viewSub = this.facWorkGroupService.onListView$.subscribe(value => {
    //   this.onListView = value;
    // });

    this.titleService.setTitle('WorkGroup Center');
  }

  setActiveCourse(course: Course): void {
    this.activeCourse = course;
    this.activeCourseId = this.activeCourse.id;
    this.facWorkGroupService.course(course);

    this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route });

  }

  activate(force?: boolean): void {

    //this.facWorkGroupService.onListView(true);

    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) { return 1; }
      if (crseA.startDate > crseB.startDate) { return -1; }
      return 0;
    });

    this.courses.forEach((course: Course) => course['displayName'] = `${course.classNumber}: ${course.name}`);

    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;
    this.facWorkGroupService.course(this.activeCourse);

    //Removed to fix canceled route due to path match in routeback component
    //this.router.navigate(['list', this.activeCourseId], { relativeTo: this.route });

  }

  refreshData() {
    this.loadingService.register();
    this.facultyDataContext.getActiveCourse(this.activeCourseId, true).then(res => {
      this.loadingService.resolve();
      this.setActiveCourse(res as Course);
    }).catch(error => {
      this.loadingService.resolve();
      this.dialogService.openAlert({message: 'Error refreshing Course list. Please try again.', title: 'Error Retrieving Course'});        
    });
  }

}
