import { EntityBase } from '../EntityBase';
import { SpResultBreakOut } from './SpResultBreakOut';
import { Course } from './Course';
import { CrseStudentInGroup } from './CrseStudentInGroup';
import { WorkGroup } from './WorkGroup';
import { SpInstrument } from './SpInstrument';

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

