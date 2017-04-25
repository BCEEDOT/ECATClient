import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StudentInCourse extends EntityBase {
   // Generated code. Do not place code below this line.
   studentPersonId: number;
   courseId: number;
   bbCourseMemId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   course: Course;
   student: ProfileStudent;
   workGroupEnrollments: CrseStudentInGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

