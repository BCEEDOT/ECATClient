import { EntityBase } from '../entitybase';
import { Course } from './course';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpInventory } from './spInventory';
import { WorkGroup } from './workGroup';

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
   modifiedById: number;
   modifiedDate: Date;
   assessee: CrseStudentInGroup;
   assessor: CrseStudentInGroup;
   course: Course;
   inventoryItem: SpInventory;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

