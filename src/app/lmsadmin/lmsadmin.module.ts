import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { CovalentPagingModule } from '@covalent/core';
import { CoursesComponent } from './courses/courses.component';
import { LmsAdminRoutingModule } from "./lmsadmin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { EntityLmsadminModule } from "../core/entities/lmsadmin";
import { LmsadminAuthGuardService } from "./services/lmsadmin-auth-guard.service";
import { LmsadminDataContextService } from "./services/lmsadmin-data-context.service";
import { LmsadminComponent } from './lmsadmin.component';
import { GroupSetsComponent } from './group-sets/group-sets.component';
import { ManageGroupsetComponent } from './group-sets/manage-groupset/manage-groupset.component';
import { CourseEnrollComponent } from './courses/course-enroll/course-enroll.component';
import { ConfigGroupsetComponent } from './group-sets/config-groupset/config-groupset.component';
import { CourseInfoComponent } from './courses/course-info/course-info.component';

@NgModule({
  imports: [
    LmsAdminRoutingModule,
    EntityLmsadminModule,
    SharedModule,
    CovalentPagingModule,
  ],
  declarations: [
    LmsadminComponent,
    CoursesComponent, 
    GroupSetsComponent, 
    ManageGroupsetComponent, 
    CourseEnrollComponent, 
    ConfigGroupsetComponent, 
    CourseInfoComponent,
  ],
  providers: [
    LmsadminAuthGuardService,
    LmsadminDataContextService
  ]
})
export class LmsadminModule { }
