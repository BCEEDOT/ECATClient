import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { FacultyAuthGuardService } from './services/faculty-auth-guard.service';
import { FacultyDataContextService } from './services/faculty-data-context.service';
import { WorkGroupsComponent } from './workgroups/work-groups.component';
import { FacultyComponent } from './faculty.component';
import { ListComponent } from './workgroups/list/list.component';
import { GlobalService } from '../core/services/global.service';
import { Course } from '../core/entities/faculty';

const facultyRoutes: Routes = [
  {
    path: 'faculty',
    // Check if role is student, spin up Student Data Context
    canActivate: [FacultyAuthGuardService],
    children: [
      {
        path: 'workgroups',
        component: FacultyComponent,
        canActivateChild: [FacultyAuthGuardService],
        // Get the students courses
        resolve: { courses: 'coursesResolver' },
            children: [
              // {
              //   path: '',
              //   component: AssessComponent,
              //   //Set active course and workgroup. Determine if results are published for active group. 
              // },

              {
                path: 'list/:crsId',
                // set to most recent course, allow student to switch between courses.
                component: ListComponent,
                // children: [
                //   { path: 'sp', component: SpComponent},
                //   { path: 'comment', component: CommentComponent}
                // ]
                resolve: { course: 'courseResolver' },
              // },
              // {
              //   path: 'results/:crsId/:wrkGrpId',
              //   component: ResultsComponent,
              //   //resolve: { results: 'resultsResolver' },
              // },
              // {
              //   path: 'list/:crsId/:wrkGrpId/assess/:assesseeId',
              //   component: AssessComponent,
              //   resolve: { inventories: 'spAssessResolver' }
              // },
              // {
              //   path: '',
              //   component: StudentComponent,
              //   resolve: { assess: 'assessmentResolver'},
               }

            ]
          }
        ]
      }
    ]


export function coursesResolver(facultyDataContext: FacultyDataContextService){
   return (route: ActivatedRouteSnapshot) => facultyDataContext.initCourses();
 }

export function courseResolver(facultyDataContext: FacultyDataContextService) {
  return (route: ActivatedRouteSnapshot) => facultyDataContext.getActiveCourse(+route.params['crsId']);
}

// export function spAssessResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.getSpInventory(+route.params['crsId'], 
// +route.params['wrkGrpId'], +route.params['assesseeId']);
// }

// export function courseResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.course(+route.params['id']);
// }

// export function workGroupsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.workGroups(+route.parent.params['workgroup']);
// }

// export function workGroupResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.workgroup(+route.params['id']);
// }

// export function listResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.list(+route.params['id']);
// }

// export function resultsResolver(studentDataContext: StudentDataContext) {
//   return (route: ActivatedRouteSnapshot) => studentDataContext.results(+route.params['id']);
// }

@NgModule({
  imports: [
    RouterModule.forChild(facultyRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    {
      provide: 'coursesResolver', useFactory: coursesResolver, deps: [FacultyDataContextService]
    },
    {
      provide: 'courseResolver', useFactory: courseResolver, deps: [FacultyDataContextService]
    },
    // {
    //   provide: 'spAssessResolver', useFactory: spAssessResolver, deps: [StudentDataContext]
    // }
  ]
})
export class FacultyRoutingModule { }
