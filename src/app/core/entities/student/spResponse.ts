import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { WorkGroup } from './workGroup';
import { SpInventory } from './spInventory';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SpResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assessorPersonId: number;
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   inventoryItemId: number;
   mpItemResponse: string;
   itemModelScore: number;
   assessee: CrseStudentInGroup;
   assessor: CrseStudentInGroup;
   course: Course;
   inventoryItem: SpInventory;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

