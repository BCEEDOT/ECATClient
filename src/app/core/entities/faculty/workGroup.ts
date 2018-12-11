import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacSpComment } from './facSpComment';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { SpResponse } from './spResponse';
import { SpInstrument } from './spInstrument';
import { FacSpResponse } from './facSpResponse';
import { FacStratResponse } from './facStratResponse';
import { StudSpComment } from './studSpComment';
import { SpResult } from './spResult';
import { StratResponse } from './stratResponse';
import { StratResult } from './stratResult';
import { WorkGroupModel } from './workGroupModel';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class WorkGroup extends EntityBase {
   // Generated code. Do not place code below this line.
   workGroupId: number;
   courseId: number;
   wgModelId: number;
   mpCategory: string;
   groupNumber: string;
   assignedSpInstrId: number;
   assignedKcInstrId: number;
   customName: string;
   defaultName: string;
   mpSpStatus: string;
   isPrimary: boolean;
   modifiedById: number;
   modifiedDate: Date;
   assignedSpInstr: SpInstrument;
   course: Course;
   facSpComments: FacSpComment[];
   facSpResponses: FacSpResponse[];
   facStratResponses: FacStratResponse[];
   groupMembers: CrseStudentInGroup[];
   spComments: StudSpComment[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];
   wgModel: WorkGroupModel;

   /// <code> Place custom code between <code> tags
   canPublish: boolean = null;
   /// </code>

}

