import { EntityBase } from '../entitybase';
import { FacultyInCourse } from './facultyInCourse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacStratResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   stratPosition: number;
   stratResultId: number;
   facultyPersonId: number;
   modifiedById: number;
   modifiedDate: Date;
   facultyAssessor: FacultyInCourse;
   studentAssessee: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

