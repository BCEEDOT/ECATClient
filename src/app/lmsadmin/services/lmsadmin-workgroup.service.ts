import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { WorkGroupModel } from "../../core/entities/lmsadmin";

@Injectable()
export class LmsadminWorkgroupService {

  workGroupModels$: BehaviorSubject<WorkGroupModel[]> = new BehaviorSubject({} as WorkGroupModel[]);

  workGroupModels(workGroupModels: WorkGroupModel[]) {
        this.workGroupModels$.next(workGroupModels);
    }

}
