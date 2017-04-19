import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { StudSpCommentFlag } from './StudSpCommentFlag';
import { WorkGroup } from './WorkGroup';

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
   modifiedById: number;
   modifiedDate: Date;
   author: CrseStudentInGroup;
   course: Course;
   flag: StudSpCommentFlag;
   recipient: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

