import { EntityBase } from '../entitybase';
import { Course } from './course';
import { SpResponse } from './spResponse';
import { CrseStudentInGroup } from './crseStudentInGroup';
import { StratResponse } from './stratResponse';
import { StudSpComment } from './studSpComment';
import { SpInstrument } from './spInstrument';
import { SpResult } from './spResult';
import { StratResult } from './stratResult';
import { FacSpResponse } from "../faculty/facSpResponse";

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
   assignedSpInstr: SpInstrument;
   course: Course;
   groupMembers: CrseStudentInGroup[];
   spComments: StudSpComment[];
   spResponses: SpResponse[];
   spResults: SpResult[];
   spStratResponses: StratResponse[];
   spStratResults: StratResult[];

   /// <code> Place custom code between <code> tags
   displayName: string;
   facSpResponses: FacSpResponse[];
   /// </code>

}

