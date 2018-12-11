import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacSpComment } from './facSpComment';
import { FacSpResponse } from './facSpResponse';
import { FacStratResponse } from './facStratResponse';
import { ProfileFaculty } from './profileFaculty';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacultyInCourse extends EntityBase {
   // Generated code. Do not place code below this line.
   facultyPersonId: number;
   courseId: number;
   bbCourseMemId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   course: Course;
   facSpComments: FacSpComment[];
   facSpResponses: FacSpResponse[];
   facStratResponse: FacStratResponse[];
   facultyProfile: ProfileFaculty;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

