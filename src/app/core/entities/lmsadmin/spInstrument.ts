import { EntityBase } from '../entitybase';
import { WorkGroup } from './workGroup';
import { SpInventory } from './spInventory';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SpInstrument extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   name: string;
   isActive: boolean;
   version: string;
   studentInstructions: string;
   facultyInstructions: string;
   modifiedDate: Date;
   modifiedById: number;
   assignedGroups: WorkGroup[];
   inventoryCollection: SpInventory[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

