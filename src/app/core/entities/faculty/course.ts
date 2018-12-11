import { EntityBase } from '../entitybase';
import { FacultyInCourse } from './facultyInCourse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpResponse } from './spResponse';
import { WorkGroup } from './workGroup';
import { SpResult } from './spResult';
import { StratResult } from './stratResult';
import { StudentInCourse } from './studentInCourse';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Course extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   academyId: string;
   name: string;
   classNumber: string;
   term: string;
   gradReportPublished: boolean;
   startDate: Date;
   gradDate: Date;
   faculty: FacultyInCourse[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   stratResults: StratResult[];
   studentInCrseGroups: CrseStudentInGroup[];
   students: StudentInCourse[];
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

