import { EntityBase } from '../entitybase';
import { SpInstrument } from './spInstrument';
import { WorkGroup } from './workGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class WorkGroupModel extends EntityBase {
   // Generated code. Do not place code below this line.
   id: number;
   name: string;
   assignedSpInstrId: number;
   mpEdLevel: string;
   mpWgCategory: string;
   maxStratStudent: number;
   maxStratFaculty: number;
   isActive: boolean;
   stratDivisor: number;
   studStratCol: string;
   facStratCol: string;
   assignedSpInstr: SpInstrument;
   workGroups: WorkGroup[];

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

