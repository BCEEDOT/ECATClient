import { EntityBase } from '../entitybase';
import { Course } from './course';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class CourseReconResult extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   academyId: string;
   numAdded: number;
   numRemoved: number;
   courses: Course[];

   /// <code> Place custom code between <code> tags
   hasToken: boolean;
   /// </code>

}

