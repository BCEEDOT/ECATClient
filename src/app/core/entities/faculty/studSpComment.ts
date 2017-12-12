import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { WorkGroup } from './workGroup';
import { StudSpCommentFlag } from './studSpCommentFlag';

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

   get shortText(): string {
    if (this.commentText && this.commentText.length > 250){
        return this.commentText.substring(0, 250) + ' [...]';
    }
    return null;
   }
   /// </code>

}

