import { EntityBase } from '../entitybase';
import { Course } from './course';
import { FacStratResponse } from './facStratResponse';
import { StratResponse } from './stratResponse';
import { GroupMemReconResult } from './groupMemReconResult';
import { SpResult } from './spResult';
import { WorkGroup } from './workGroup';
import { StratResult } from './stratResult';
import { StudentInCourse } from './studentInCourse';
import { ProfileStudent } from './profileStudent';

/// <code-import> Place custom imports between <code-import> tags
import { EcLocalDataService } from "../../common/static"
/// </code-import>

export class CrseStudentInGroup extends EntityBase {
    // Generated code. Do not place code below this line.
    studentId: number;
    courseId: number;
    workGroupId: number;
    hasAcknowledged: boolean;
    bbCrseStudGroupId: string;
    reconResultId: string;
    isDeleted: boolean;
    deletedById: number;
    deletedDate: Date;
    modifiedById: number;
    modifiedDate: Date;
    assesseeStratResponse: StratResponse[];
    assessorStratResponse: StratResponse[];
    course: Course;
    facultyStrat: FacStratResponse;
    reconResult: GroupMemReconResult;
    spResult: SpResult;
    stratResult: StratResult;
    studentInCourse: StudentInCourse;
    studentProfile: ProfileStudent;
    workGroup: WorkGroup;

    /// <code> Place custom code between <code> tags
    changeDescription: string;
    notAssignedToGroup: boolean;

    set rankName(name: string) {
        this.rankName = name;
    }

    get rankName(): string {
        let _salutation: string;
        const p = (this.studentProfile) ? this.studentProfile.person : null;
        if (p && !_salutation) _salutation = EcLocalDataService.getSalutation(p.mpPaygrade, p.mpComponent, p.mpAffiliation);

        return (!p) ? 'Unk' : `${_salutation} ${this.studentProfile.person.lastName}, ${this.studentProfile.person.firstName}`;
    }
    /// </code>

}

