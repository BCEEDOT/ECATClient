import { EntityBase } from '../entitybase';
import { CrseStudentInGroup } from './crseStudentInGroup';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class StratResponse extends EntityBase {
   // Generated code. Do not place code below this line.
   assessorPersonId: number;
   assesseePersonId: number;
   courseId: number;
   workGroupId: number;
   stratPosition: number;
   modifiedById: number;
   modifiedDate: Date;
   assessee: CrseStudentInGroup;
   assessor: CrseStudentInGroup;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

