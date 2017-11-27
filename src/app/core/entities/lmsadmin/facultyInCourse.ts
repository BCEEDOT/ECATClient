import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacStratResponse } from './facStratResponse';
import { MemReconResult } from './memReconResult';
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
   reconResultId: string;
   course: Course;
   facStratResponse: FacStratResponse[];
   facultyProfile: ProfileFaculty;
   reconResult: MemReconResult;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

