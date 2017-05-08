import { MpSpStatus } from '../core/common/mapStrings';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";


import { Course, WorkGroup } from "../core/entities/student";
import { GlobalService } from "../core/services/global.service";
import { StudentDataContext } from "./services/student-data-context.service";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'ecat-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class StudentComponent implements OnInit {

  //courses: Observable<Course[]>;
  activeCourseId: number;
  courses$: Observable<Course[]>;
  courses: Course[];
  workGroups: WorkGroup[];
  activeWorkgroup: WorkGroup;
  grpDisplayName = 'Not Set';

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    private studentDataContext: StudentDataContext,
    public media: TdMediaService,
    private global: GlobalService) {

    this.courses$ = <any>route.data.pluck('assess');
  }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    //this.media.broadcast();
    this.titleService.setTitle('ECAT Users');

    this.courses$.subscribe(courses => {
      this.courses = courses;
      this.activate();
    });


  }

  private activate(force?: boolean): void {

    this.courses.forEach(course => course['displayName'] = `${course.classNumber}: ${course.name}`);
    let activeCourse: Course;
    activeCourse = this.courses[0];
    this.workGroups = activeCourse.workGroups;
    this.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
    this.activeCourseId = activeCourse.id;
    let activeWorkgroup = this.workGroups[0];

    this.setActiveWorkgroup(activeWorkgroup, force);


  }

  private setActiveWorkgroup(workGroup: WorkGroup, force?: boolean): void {
    this.grpDisplayName = `${workGroup.mpCategory}: ${workGroup.customName || workGroup.defaultName}`;
    this.activeWorkgroup = workGroup;
    const viewOnly = workGroup.mpSpStatus !== MpSpStatus.open;
    const workGroupId = (workGroup) ? workGroup.workGroupId : 0;

    if (!force) {
      true ? this.router.navigate(['list', this.activeCourseId, workGroupId], { relativeTo: this.route }) : this.router.navigate(['results', this.activeCourseId, workGroupId], { relativeTo: this.route });
    }
  }







  // initCourses(): void {
  //   //maps to ng-template tag
  //   this.loadingService.register('course.list');
  //   this.studentDataContext.initCourses()
  //       .then((courses) => {
  //         this.courses = courses;
  //         this.loadingService.resolve('course.list');
  //         console.log(this.courses);
  //       })
  //       .catch(e => {
  //         this.loadingService.resolve('course.list');
  //         console.log('error getting users');
  //         console.log(e);
  //       })

  // }


  // loadUsers(): void {
  //   this._loadingService.register('users.list');
  //   this._usersService.query().subscribe((users: IUser[]) => {
  //     this.users = users;
  //     this.filteredUsers = users;
  //     this._loadingService.resolve('users.list');
  //   }, (error: Error) => {
  //     this._usersService.staticQuery().subscribe((users: IUser[]) => {
  //       this.users = users;
  //       this.filteredUsers = users;
  //       this._loadingService.resolve('users.list');
  //     });
  //   });
  // }

  // filterUsers(displayName: string = ''): void {
  //   this.filteredUsers = this.users.filter((user: IUser) => {
  //     return user.displayName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
  //   });
  // }

  // deleteUser(id: string): void {
  //   this._dialogService
  //     .openConfirm({message: 'Are you sure you want to delete this user?'})
  //     .afterClosed().subscribe((confirm: boolean) => {
  //       if (confirm) {
  //         this._loadingService.register('users.list');
  //         this._usersService.delete(id).subscribe(() => {
  //           this.users = this.users.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this._loadingService.resolve('users.list');
  //           this._snackBarService.open('User deleted', 'Ok');
  //         }, (error: Error) => {
  //           this._dialogService.openAlert({message: 'There was an error'});
  //           this._loadingService.resolve('users.list');
  //         });
  //       }
  //     });
  // }

}
