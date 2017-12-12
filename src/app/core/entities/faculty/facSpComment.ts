import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacultyInCourse } from './facultyInCourse';
import { FacSpCommentFlag } from './facSpCommentFlag';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacSpComment extends EntityBase {
   // Generated code. Do not place code below this line.
   recipientPersonId: number;
   courseId: number;
   workGroupId: number;
   facultyPersonId: number;
   createdDate: Date;
   commentText: string;
   modifiedById: number;
   modifiedDate: Date;
   course: Course;
   facultyCourse: FacultyInCourse;
   flag: FacSpCommentFlag;
   recipient: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

