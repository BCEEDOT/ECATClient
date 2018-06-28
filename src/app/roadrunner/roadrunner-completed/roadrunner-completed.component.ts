import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RoadrunnerService } from '../services/roadrunner.service';
import { RoadRunner } from "../../core/entities/user";
import { Subscription } from "rxjs";

@Component({
  selector: 'roadrunner-completed',
  templateUrl: './roadrunner-completed.component.html',
  styleUrls: ['../roadrunner.component.scss']
})
export class RoadrunnerCompletedComponent implements OnInit, OnDestroy {
  count:number;
  countSub: Subscription;
  signedOut: boolean;
  soSub: Subscription;
  @Input() roadRunnerInfos: RoadRunner[];

  constructor( private roadRunnerService:RoadrunnerService) { }

  ngOnInit() {

    this.countSub = this.roadRunnerService.count$.subscribe(count => {this.count = count});
    console.log(this.roadRunnerInfos);
    this.soSub = this.roadRunnerService.signedOut$.subscribe(so => this.signedOut = so);
  }

  ngOnDestroy(){
    this.countSub.unsubscribe();
    this.soSub.unsubscribe();
  }
}
