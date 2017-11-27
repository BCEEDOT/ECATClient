import { EntityBase } from '../entitybase';
import { SpResultBreakOut } from './spResultBreakOut';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpInstrument } from './spInstrument';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

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
   modifiedById: number;
   modifiedDate: Date;
   assignedInstrument: SpInstrument;
   course: Course;
   resultFor: CrseStudentInGroup;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

