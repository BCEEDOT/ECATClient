import { EntityBase } from '../entitybase';
import { FacultyInCourse } from './facultyInCourse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpInventory } from './spInventory';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class FacSpResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   inventoryItemId: number;
   facultyPersonId: number;
   mpItemResponse: string;
   itemModelScore: number;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   modifiedById: number;
   modifiedDate: Date;
   assessee: CrseStudentInGroup;
   facultyAssessor: FacultyInCourse;
   inventoryItem: SpInventory;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

