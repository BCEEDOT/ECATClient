import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { WorkGroupService } from "../../services/workgroup.service";

@Component({
  selector: 'app-route-back',
  templateUrl: './route-back.component.html',
  styleUrls: ['./route-back.component.scss']
})
export class RouteBackComponent implements OnInit {

  constructor(private workGroupService: WorkGroupService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let workGroup = this.workGroupService.workGroup$.value;

    if (workGroup.mpSpStatus === 'Published') {
      this.router.navigate(['results', workGroup.courseId, workGroup.workGroupId], { relativeTo: this.route });
    } else {
      this.router.navigate(['list', workGroup.courseId, workGroup.workGroupId], { relativeTo: this.route });
    }
  }

}
