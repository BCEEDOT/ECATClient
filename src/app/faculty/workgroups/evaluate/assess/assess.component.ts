import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { MpCommentType } from '../../../../core/common/mapStrings';
import { CrseStudentInGroup, WorkGroup } from '../../../../core/entities/faculty';
import { SpProviderService } from '../../../../provider/sp-provider/sp-provider.service';
import { FacWorkgroupService } from '../../../services/facworkgroup.service';


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class EvaluateAssessComponent implements OnInit, OnDestroy {

  groupMembers: CrseStudentInGroup[];
  workGroup: WorkGroup;
  readOnly: boolean = false;
  roSub: Subscription;
  wgSub: Subscription;

  constructor(private spProvider: SpProviderService,
  private facWorkGroupService: FacWorkgroupService) { }

  ngOnInit() {
    this.roSub = this.facWorkGroupService.readOnly$.subscribe(status => {
      this.readOnly = status;
      if (this.workGroup) {
        this.activate();
      }
      
    });

    this.wgSub = this.facWorkGroupService.facWorkGroup$.subscribe(workGroup => {
      this.workGroup = workGroup;
      this.activate();
    });
  
  }

  ngOnDestroy() {
    this.roSub.unsubscribe();
    this.wgSub.unsubscribe();
  }

  activate():void {
    this.groupMembers = this.workGroup.groupMembers as CrseStudentInGroup[];

    this.groupMembers.forEach(gm => {
      gm.updateStatusOfStudent();
      const hasComment = gm.statusOfStudent.hasComment;
      const assessComplete = gm.statusOfStudent.assessComplete;
      gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
      let commentText = '';
      let assessText = '';

      if (this.readOnly) {
        commentText = hasComment ? 'comment' : 'not_interested';
        assessText = assessComplete ? 'view_list' : 'None';
      } else {
        commentText = hasComment ? 'mode_edit' : 'add';
        assessText = assessComplete ? 'mode_edit' : 'add';
      }
      gm['commentText'] = commentText;
      gm['assessText'] = assessText;

    });

    if (!this.groupMembers.some(mem => mem.statusOfStudent.assessComplete === false)){
      this.facWorkGroupService.assessComplete(true);
    } else {
      this.facWorkGroupService.assessComplete(false);
    }
  }


  comment(recipient: CrseStudentInGroup): any {
    this.spProvider.loadComment(recipient).subscribe(() => { this.activate()});
  }

}
