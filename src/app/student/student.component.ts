import { MpSpStatus } from "../core/common/mapStrings";
import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  AfterContentChecked
} from "@angular/core";
import { ActivatedRoute, Router, UrlSegment, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import {
  TdLoadingService,
  TdDialogService,
  TdMediaService
} from "@covalent/core";
import { Observable, Subscription, Observer, of } from "rxjs";
import { pluck, filter, pairwise } from "rxjs/Operators";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from "@angular/material";
import { DOCUMENT } from "@angular/platform-browser";

import { Course, WorkGroup, StratResponse } from "../core/entities/student";
import { WorkGroupService } from "./services/workgroup.service";
import { StudentDataContext } from "./services/student-data-context.service";
import { AssessCompareDialog } from "./shared/assess-compare/assess-compare.dialog";

@Component({
  // Selector only needed if another template is going to refernece
  selector: "ecat-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"]
  // Limits only to current view and not children
  // viewProviders: [ UsersService ],
})
export class StudentComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  activeCourseId: number;
  activeWorkGroupId: number;
  courses$: Observable<Course[]>;
  courses: Course[];
  workGroups: WorkGroup[];
  activeCourse: Course;
  activeWorkGroup: WorkGroup;
  grpDisplayName: string = "Not Set";
  assessIsLoaded: string = "assessIsLoaded";
  dialogRef: MatDialogRef<AssessCompareDialog>;
  //onListView: boolean = true;
  onListView$: Observable<boolean>;
  viewSub: Subscription;
  noWorkGroup: boolean = false;

  constructor(
    private titleService: Title,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    public media: TdMediaService,
    private workGroupService: WorkGroupService,
    private studentDataContext: StudentDataContext,
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any
  ) {

    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        pairwise()
      )

      .subscribe((event: any[]) => {
        var previousRoute = event[0].urlAfterRedirects;
        var newRoute = event[1].urlAfterRedirects;

        var matchPreviousRoute = previousRoute.match("list|result");
        var matchNewRoute = newRoute.match("^/student/assessment$");

        if (matchPreviousRoute && matchNewRoute) {
          this.activate(false);
        }
      });

    this.courses$ = route.data.pipe(pluck("assess"));
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.workGroupService.workGroup(undefined);
    //this.viewSub.unsubscribe();
  }

  ngOnInit(): void {
    this.titleService.setTitle("Assessment Center");
    this.courses$.subscribe((courses: Course[]) => {
      this.courses = courses;
      if (courses.length > 0) {
        this.activate(false);
      }
    });

    this.onListView$ = this.workGroupService.onListView$.asObservable();

    // this.viewSub = this.workGroupService.onListView$.subscribe((value: boolean) => {
    //   this.onListView = value;
    // });
  }

  goBack(route: string): void {
    this.router.navigate(["/"]);
  }

  refreshFromServer(): void {
    this.workGroupService.isLoading(true);
    if (this.activeCourse) {
      this.workGroupService.isLoading(false);
      this.setActiveCourse(this.activeCourse);
    } else {
      this.studentDataContext
        .initCourses()
        .then((courses: Course[]) => {
          if (courses.length > 0) {
            if (courses[0].workGroups.length > 0) {
              this.studentDataContext
                .fetchActiveWorkGroup(
                  courses[0].workGroups[0].workGroupId,
                  true
                )
                .then((workgroup: WorkGroup) => {
                  this.workGroupService.isLoading(false);
                  this.courses = courses;
                  this.activate(false);
                })
                .catch((error: Event) => {
                  this.workGroupService.isLoading(false);
                  this.dialogService.openAlert({
                    message:
                      "There was a problem loading your work group, please try again.",
                    title: "Load Error"
                  });
                  this.workGroupService.isLoading(false);
                });
            } else {
              this.workGroupService.isLoading(false);
              this.courses = courses;
              this.activate(false);
            }
          } else {
            this.workGroupService.isLoading(false);
            this.courses = courses;
          }
        })
        .catch((error: Event) => {
          this.workGroupService.isLoading(false);
          this.dialogService.openAlert({
            message:
              "There was a problem loading your course, please try again.",
            title: "Load Error"
          });
          this.workGroupService.isLoading(false);
        });
    }
  }

  activate(force?: boolean): void {
    this.courses.sort((crseA: Course, crseB: Course) => {
      if (crseA.startDate < crseB.startDate) {
        return 1;
      }
      if (crseA.startDate > crseB.startDate) {
        return -1;
      }
      return 0;
    });

    this.courses.forEach((course: Course) => {
      course.displayName = course.classNumber + ": " + course.name;
    });

    this.activeCourse = this.courses[0];
    this.activeCourseId = this.activeCourse.id;

    if (this.activeCourse.workGroups.length > 0) {
      this.initWorkGroups(this.activeCourse.workGroups);
    } else {
      this.noWorkGroup = true;
    }
  }

  initWorkGroups(workGroups: WorkGroup[]): void {
    this.workGroups = workGroups;
    this.workGroups.sort((wgA: WorkGroup, wgB: WorkGroup) => {
      if (wgA.mpCategory < wgB.mpCategory) {
        return 1;
      }
      if (wgA.mpCategory > wgB.mpCategory) {
        return -1;
      }
      return 0;
    });
    this.workGroups.forEach((wg: WorkGroup) => {
      wg.displayName = `${wg.mpCategory}: ${wg.customName || wg.defaultName}`;
    });
    this.initActiveWorkGroup(this.workGroups[0]);
  }

  initActiveWorkGroup(workGroup: WorkGroup): void {
    this.activeWorkGroup = workGroup;
    this.activeWorkGroupId = this.activeWorkGroup.workGroupId;
    this.grpDisplayName = `${this.activeWorkGroup.mpCategory}: ${this
      .activeWorkGroup.customName || this.activeWorkGroup.defaultName}`;

    if (this.activeWorkGroup.groupMembers.length < 1) {
      this.setActiveWorkGroup(workGroup);
    } else {
      this.workGroupService.workGroup(this.activeWorkGroup);
      this.nav(this.activeWorkGroup);
    }
  }

  assessCompare(): void {
    this.dialogRef = this.dialog.open(AssessCompareDialog, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: "",
      width: "950px",
      height: "",
      position: {
        top: "",
        bottom: "",
        left: "",
        right: ""
      },
      data: {
        workGroup: this.activeWorkGroup
      }
    });
  }

  setActiveCourse(course: Course): void {
    this.canRoute().subscribe(canRoute => {
      if (canRoute) {
        this.workGroupService.isLoading(true);

        this.studentDataContext
          .fetchActiveCourse(course.id, true)
          .then((courseValue: Course) => {
            this.activeCourse = courseValue;
            this.activeCourseId = this.activeCourse.id;

            if (this.activeCourse.workGroups.length > 0) {
              this.initWorkGroups(this.activeCourse.workGroups);
            } else {
              this.dialogService.openAlert({
                message: 'No Workgroup Enrollments for ' + this.activeCourse.name
              });
            }
            this.workGroupService.isLoading(false);
          })
          .catch((error: Event) => {
            this.dialogService.openAlert({
              message:
                "There was a problem loading your course, please try again.",
              title: "Load Error"
            });
            this.workGroupService.isLoading(false);
          });
      }
    });
  }

  nav(workGroup: WorkGroup): void {
    const resultsPublished: boolean =
      this.activeWorkGroup.mpSpStatus === MpSpStatus.published;

    resultsPublished
      ? this.router.navigate(
          ["results", this.activeCourseId, this.activeWorkGroupId],
          { relativeTo: this.route }
        )
      : this.router.navigate(
          ["list", this.activeCourseId, this.activeWorkGroupId, "main"],
          { relativeTo: this.route }
        );
  }

  setActiveWorkGroup(workGroup: WorkGroup): void {
    this.canRoute().subscribe(canRoute => {
      if (canRoute) {
        this.workGroupService.isLoading(true);
        this.studentDataContext
          .fetchActiveWorkGroup(workGroup.workGroupId, true)
          .then((workGroupValue: WorkGroup) => {
            this.initActiveWorkGroup(workGroupValue);
            this.workGroupService.isLoading(false);
          })
          .catch((error: Event) => {
            this.dialogService.openAlert({
              message:
                "There was a problem loading your Work Group, please try again.",
              title: "Load Error"
            });
            this.workGroupService.isLoading(false);
          });
      }
    });
  }

  canRoute(): Observable<boolean> {
    let changes = [];

    changes = this.studentDataContext.getChanges();

    if (changes.length === 0) {
      return of(true);
    }

    let onlyStratChanges = changes.every(
      (change: StratResponse) =>
        change.entityType.shortName === "StratResponse" &&
        change.stratPosition === 0
    );

    if (onlyStratChanges) {
      this.studentDataContext.rollback();
      return of(true);
    }

    return Observable.create((observer: Observer<boolean>) => {
      this.dialogService
        .openConfirm({
          message: "Are you sure you want to leave this page?",
          title: "Unsaved Changes",
          acceptButton: "Yes",
          cancelButton: "No"
        })
        .afterClosed()
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.studentDataContext.rollback();
            this.studentDataContext.getChanges();
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
