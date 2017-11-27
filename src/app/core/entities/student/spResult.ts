import { EntityBase } from '../entitybase';
import { SpResultBreakOut } from './spResultBreakOut';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { WorkGroup } from './workGroup';
import { SpInstrument } from './spInstrument';
import { SanitizedSpComment } from './sanitizedSpComment';
import { SanitizedSpResponse } from './sanitizedSpResponse';

/// <code-import> Place custom imports between <code-import> tags
import { FacSpResponse } from '../faculty/facSpResponse'
/// </code-import>

export class SpResult extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   assignedInstrumentId: number;
   mpAssessResult: string;
   compositeScore: number;
   breakOut: SpResultBreakOut;
   assignedInstrument: SpInstrument;
   course: Course;
   resultFor: CrseStudentInGroup;
   sanitizedComments: SanitizedSpComment[];
   sanitizedResponses: SanitizedSpResponse[];
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   facultyResponses: FacSpResponse[]
   /// </code>

}

