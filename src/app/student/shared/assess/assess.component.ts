import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MdSnackBar } from '@angular/material';

import { Course, WorkGroup, CrseStudentInGroup } from "../../../core/entities/student";
import { WorkGroupService } from "../../services/workgroup.service";
import { GlobalService } from "../../../core/services/global.service"


@Component({
  selector: 'assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss']
})
export class AssessComponent implements OnInit {

  activeWorkGroup: WorkGroup;
  user: CrseStudentInGroup
  peers: Array<CrseStudentInGroup>;
  userId: number;
  assessIsLoaded = 'assessIsLoaded';

  constructor(private workGroupService: WorkGroupService, private global: GlobalService,
    private loadingService: TdLoadingService, private snackBarService: MdSnackBar) {
  }

  @Input() workGroup: WorkGroup;
  @Output() assessCompare = new EventEmitter();

  ngOnInit() {

    this.activate();

  }

  activate() {
    // this.workGroupService.workGroup$.subscribe(workGroup => {
    //   this.activeWorkGroup = workGroup;
    // });
    this.activeWorkGroup = this.workGroup;
    const userId = this.global.persona.value.person.personId;

    this.user = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId == userId)[0];

    this.user.updateStatusOfPeer();

    this.activeWorkGroup.groupMembers.forEach(gm => {
      gm['assessText'] = (this.user.statusOfPeer[gm.studentId].assessComplete) ? 'Edit' : 'Add';
      gm['commentText'] = (this.user.statusOfPeer[gm.studentId].hasComment) ? 'Edit' : 'Add';
      //gm['stratText'] = (this.user.statusOfPeer[gm.studentId].stratComplete) ? this.user.statusOfPeer[gm.studentId].stratedPosition : 'None';
    });

    this.peers = this.activeWorkGroup.groupMembers.filter(gm => gm.studentId !== userId);
  }

  compare() {
    this.assessCompare.emit();
  }

}
