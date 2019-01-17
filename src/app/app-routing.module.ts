import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
//import { StudentModule } from "./student/student.module";
import { CognitivesModule } from './cognitives/cognitives.module';
import { LmsadminModule } from './lmsadmin/lmsadmin.module';
import { RoadrunnerModule } from './roadrunner/roadrunner.module';
//import { FacultyModule } from './faculty/faculty.module';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'lti/ltiEntry', redirectTo: '/dashboard' },
  //{ path: 'student', loadChildren: './student/student.module#StudentModule'},
  { path: 'lmsadmin', loadChildren: './lmsadmin/lmsadmin.module#LmsadminModule'},
  //{ path: 'faculty', loadChildren: './faculty/faculty.module#FacultyModule'},
  { path: 'roadrunner', loadChildren: './roadrunner/roadrunner.module#RoadrunnerModule'},
  { path: 'cognitives', loadChildren: './cognitives/cognitives.module#CognitivesModule'},
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [
    // Uses old style routing for older browsers eg... http://localhost/#/Home
    // RouterModule.forRoot(appRoutes, { useHash: true });
    // TODO: Disable tracing for production
    // RouterModule.forRoot(appRoutes, {
    //   onSameUrlNavigation: 'reload',
    //   enableTracing: true})
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule,
  ],
  providers: [],
})
export class AppRoutingModule { }