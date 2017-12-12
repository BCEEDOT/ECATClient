import { EntityBase } from '../entitybase';
import { FacultyInCourse } from './facultyInCourse';
import { StudentInCourse } from './studentInCourse';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class MemReconResult extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   courseId: number;
   numOfAccountCreated: number;
   academyId: string;
   numAdded: number;
   numRemoved: number;
   faculty: FacultyInCourse[];
   students: StudentInCourse[];

   /// <code> Place custom code between <code> tags
   hasToken: boolean;
   /// </code>

}

