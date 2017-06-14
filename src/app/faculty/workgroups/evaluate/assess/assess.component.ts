import { Component, OnInit, Input } from '@angular/core';

import { WorkGroup, CrseStudentInGroup } from "../../../../core/entities/faculty";
import { SpProviderService } from "../../../../provider/sp-provider/sp-provider.service";

@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  groupMembers: CrseStudentInGroup[];
  isViewOnly: boolean = false;

  constructor(private spProvider: SpProviderService,) { }

  @Input() workGroup: WorkGroup;

  ngOnInit() {
    this.groupMembers = this.workGroup.groupMembers;

    console.log(this.groupMembers);

    this.groupMembers.forEach(gm => {
      const hasComment = gm.statusOfStudent.hasComment;
      const assessComplete = gm.statusOfStudent.assessComplete;
      gm['hasChartData'] = gm.statusOfStudent.breakOutChartData.some(cd => cd.data > 0);
      let commentText = '';
      let assessText = '';

      if (this.isViewOnly) {
        commentText = hasComment ? 'View' : 'None';
        assessText = assessComplete ? 'View' : 'None';
      } else {
        commentText = hasComment ? 'mode_edit' : 'add';
        assessText = assessComplete ? 'mode_edit' : 'add';
      }
      gm['commentText'] = commentText;
      gm['assessText'] = assessText;
    });
  }

  comment(recipient: CrseStudentInGroup): any {
    this.spProvider.loadComment(recipient);
  }

}
