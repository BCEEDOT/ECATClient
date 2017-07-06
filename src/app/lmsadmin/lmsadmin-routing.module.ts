import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { LmsadminAuthGuardService } from './services/lmsadmin-auth-guard.service';
import { LmsadminDataContextService } from './services/lmsadmin-data-context.service';
import { CoursesComponent } from './courses/courses.component';
import { GroupSetsComponent } from './group-sets/group-sets.component';
import { ManageGroupsetComponent } from './group-sets/manage-groupset/manage-groupset.component';
import { LmsadminComponent } from "./lmsadmin.component";
import { CourseEnrollComponent } from "./courses/course-enroll/course-enroll.component";
import { ConfigGroupsetComponent } from "./group-sets/config-groupset/config-groupset.component";
import { CourseInfoComponent } from "./courses/course-info/course-info.component";

const lmsadminRoutes: Routes = [
  { 
    path: 'lmsadmin',
    component: LmsadminComponent,
    // Check if role is ISA, spin up ISA Data Context
    canActivate: [LmsadminAuthGuardService],
    children: [
      {
        path: 'courses',
        component: CoursesComponent,
        canActivateChild: [LmsadminAuthGuardService],
        resolve: { courses: 'isaCoursesResolver' },
      },
      {
        path: 'courses/:crsId/enrollments',
        component: CourseEnrollComponent,
        //resolve: { course: 'lmsCourseResolver' }
      },
      {
        path: 'courses/:crsId/info',
        component: CourseInfoComponent,
        //resolve: { course: 'lmsCourseResolver' }
      },
      {
        path: 'courses/:crsId/groupsets',
        component: GroupSetsComponent,
        //resolve: { course: 'lmsCourseResolver' }
      },
      {
        path: 'courses/:crsId/groupsets/:catId/manage',
        component: ManageGroupsetComponent,
        resolve: { groupSetMembers: 'isaGroupSetMembersResolver' }
      },
      {
        path: 'courses/:crsId/groupsets/:catId/config',
        component: ConfigGroupsetComponent,
        //resolve: { course: 'lmsCourseResolver' }
      },
    ]
  }
]

export function isaCoursesResolver(lmsadminDataContext: LmsadminDataContextService) {
  return (route: ActivatedRouteSnapshot) => lmsadminDataContext.fetchAllCourses();
}

export function isaGroupsResolver(lmsadminDataContext: LmsadminDataContextService) {
  return (route: ActivatedRouteSnapshot) => lmsadminDataContext.fetchAllGroups(+route.params['crsId']);
}

export function isaGroupSetMembersResolver(lmsadminDataContext: LmsadminDataContextService) {
  return (route: ActivatedRouteSnapshot) => lmsadminDataContext.fetchAllGroupSetMembers(+route.params['crsId'], route.params['catId']);
}

@NgModule({
  imports: [
    RouterModule.forChild(lmsadminRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    {
      provide: 'isaCoursesResolver', useFactory: isaCoursesResolver, deps: [LmsadminDataContextService]
    },
    {
      provide: 'isaGroupsResolver', useFactory: isaGroupsResolver, deps: [LmsadminDataContextService]
    },
    {
      provide: 'isaGroupSetMembersResolver', useFactory: isaGroupSetMembersResolver, deps: [LmsadminDataContextService]
    }
  ]
})
export class LmsAdminRoutingModule { }