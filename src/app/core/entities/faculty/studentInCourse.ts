import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { ProfileStudent } from './profileStudent';

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

