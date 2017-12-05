import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StratResult extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   originalStratPosition: number;
   finalStratPosition: number;
   stratCummScore: number;
   studStratAwardedScore: number;
   facStratAwardedScore: number;
   modifiedById: number;
   modifiedDate: Date;
   course: Course;
   resultFor: CrseStudentInGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

