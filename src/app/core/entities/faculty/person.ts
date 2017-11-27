import { EntityBase } from '../entitybase';
import { ProfileStudent } from './profileStudent';
import { ProfileFaculty } from './profileFaculty';
import { RoadRunner } from './roadRunner';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Person extends EntityBase {
   // Generated code. Do not place code below this line.
   personId: number;
   isActive: boolean;
   bbUserName: string;
   lastName: string;
   firstName: string;
   avatarLocation: string;
   goByName: string;
   mpGender: string;
   mpAffiliation: string;
   mpPaygrade: string;
   mpComponent: string;
   email: string;
   registrationComplete: boolean;
   mpInstituteRole: string;
   modifiedById: number;
   modifiedDate: Date;
   faculty: ProfileFaculty;
   roadRunnerAddresses: RoadRunner[];
   student: ProfileStudent;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

