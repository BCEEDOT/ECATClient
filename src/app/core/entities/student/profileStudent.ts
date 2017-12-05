import { EntityBase } from '../entitybase';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StudentInCourse } from './studentInCourse';
import { Person } from './person';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class ProfileStudent extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   bio: string;
   homeStation: string;
   courseGroupMemberships: CrseStudentInGroup[];
   courses: StudentInCourse[];
   person: Person;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

