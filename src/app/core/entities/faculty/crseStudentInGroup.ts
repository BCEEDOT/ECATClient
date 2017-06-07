import { EntityBase } from '../EntityBase';
import { Course } from './Course';
import { FacSpComment } from './FacSpComment';
import { SpResponse } from './SpResponse';
import { WorkGroup } from './WorkGroup';
import { FacSpResponse } from './FacSpResponse';
import { FacStratResponse } from './FacStratResponse';
import { StudSpComment } from './StudSpComment';
import { SpResult } from './SpResult';
import { StratResponse } from './StratResponse';
import { StratResult } from './StratResult';
import { StudentInCourse } from './StudentInCourse';
import { ProfileStudent } from './ProfileStudent';

/// <code-import> Place custom imports between <code-import> tags
import { EcLocalDataService } from "../../common/static";
/// </code-import>

export class CrseStudentInGroup extends EntityBase {
   // Generated code. Do not place code below this line.
   studentId: number;
   courseId: number;
   workGroupId: number;
   hasAcknowledged: boolean;
   bbCrseStudGroupId: string;
   isDeleted: boolean;
   deletedById: number;
   deletedDate: Date;
   modifiedById: number;
   modifiedDate: Date;
   assesseeSpResponses: SpResponse[];
   assesseeStratResponse: StratResponse[];
   assessorSpResponses: SpResponse[];
   assessorStratResponse: StratResponse[];
   authorOfComments: StudSpComment[];
   course: Course;
   facultyComment: FacSpComment;
   facultySpResponses: FacSpResponse[];
   facultyStrat: FacStratResponse;
   recipientOfComments: StudSpComment[];
   spResult: SpResult;
   stratResult: StratResult;
   studentInCourse: StudentInCourse;
   studentProfile: ProfileStudent;
   workGroup: WorkGroup;

   /// <code> Place custom code between <code> tags
   constructor() {
       super();
   }


   get rankName(): string {
        let _salutation: string;
        const p = (this.studentProfile) ? this.studentProfile.person : null;
        if (p && !_salutation) _salutation = EcLocalDataService.getSalutation(p.mpPaygrade, p.mpComponent, p.mpAffiliation);
        
        return (!p) ? 'Unk' : `${_salutation} ${this.studentProfile.person.lastName}, ${this.studentProfile.person.firstName}`;
    }

    static initializer(entity: CrseStudentInGroup) { }
   /// </code>

}

