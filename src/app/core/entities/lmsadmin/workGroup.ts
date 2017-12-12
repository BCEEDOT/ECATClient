import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacStratResponse } from './facStratResponse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StratResponse } from './stratResponse';
import { SpResult } from './spResult';
import { SpInstrument } from './spInstrument';
import { GroupReconResult } from './groupReconResult';
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
   reconResultId: string;
   assignedSpInstrId: number;
   assignedKcInstrId: number;
   customName: string;
   bbGroupId: string;
   defaultName: string;
   mpSpStatus: string;
   isPrimary: boolean;
   canPublish: boolean;
   modifiedById: number;
   modifiedDate: Date;
   assignedSpInstr: SpInstrument;
   course: Course;
   facStratResponses: FacStratResponse[];
   groupMembers: CrseStudentInGroup[];
   reconResult: GroupReconResult;
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];
   wgModel: WorkGroupModel;

   /// <code> Place custom code between <code> tags
   changeDescription: string;
   maxSize: number;
   toDelete: boolean;
   /// </code>

}

