import { EntityBase } from '../entitybase';
import { FacultyInCourse } from './facultyInCourse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpResult } from './spResult';
import { WorkGroup } from './workGroup';
import { StratResult } from './stratResult';
import { StudentInCourse } from './studentInCourse';
import { CourseReconResult } from './courseReconResult';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Course extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   academyId: string;
   bbCourseId: string;
   name: string;
   classNumber: string;
   term: string;
   gradReportPublished: boolean;
   startDate: Date;
   gradDate: Date;
   reconResultId: string;
   faculty: FacultyInCourse[];
   reconResult: CourseReconResult;
   spResults: SpResult[];
   stratResults: StratResult[];
   studentInCrseGroups: CrseStudentInGroup[];
   students: StudentInCourse[];
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

