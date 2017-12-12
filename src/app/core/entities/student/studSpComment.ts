import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StudSpCommentFlag } from './studSpCommentFlag';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StudSpComment extends EntityBase {
   // Generated code. Do not place code below this line.
   authorPersonId: number;
   recipientPersonId: number;
   courseId: number;
   workGroupId: number;
   facultyPersonId: number;
   requestAnonymity: boolean;
   commentText: string;
   createdDate: Date;
   author: CrseStudentInGroup;
   course: Course;
   flag: StudSpCommentFlag;
   recipient: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

