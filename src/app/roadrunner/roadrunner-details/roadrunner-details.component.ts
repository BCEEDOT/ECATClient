import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TdDialogService } from '@covalent/core';
import { isEmpty } from 'lodash-es';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { GlobalService } from "../../core/services/global.service";
import { RoadrunnerService } from '../services/roadrunner.service';
import { UserDataContext } from '../../core/services/data/user-data-context.service';
import { RoadRunner } from '../../core/entities/user';

@Component({
    templateUrl: './roadrunner-details.component.html',
    styleUrls: ['./roadrunner-details.component.scss']

})

export class RoadrunnerDetailsComponent implements OnInit, OnDestroy {

    event: RoadRunner[];
    eventSub: Subscription;
    signedOut: boolean;
    soSub: Subscription;
    leavedate: string;
    oneEvent: RoadRunner;
    tempEvent: RoadRunner;
    id: number;
    checkNew: string;
    isNew: boolean;
    startCheck: boolean = false;
    endCheck: boolean = false;
    touch: boolean = true;
    minDate: Date = new Date(2017, 0, 1);
    maxDate: Date = new Date(2020, 0, 1);
    clone: boolean = false;
    dateForm: FormGroup;

    constructor(private roadRunnerService: RoadrunnerService,
        private userDataContext: UserDataContext,
        private route: ActivatedRoute,
        private router: Router,
        private dialogService: TdDialogService,
        private global: GlobalService,
        private location: Location,
    ) {

    }

    ngOnInit(): void {

        this.eventSub = this.roadRunnerService.roadRunnerData$.subscribe((roadRunnerData: RoadRunner[]) => {
            // console.log("roadrunner update")
            this.event = roadRunnerData;
        });
        this.checkNew = (this.route.snapshot.params['id']);

        this.soSub = this.roadRunnerService.signedOut$.subscribe(so => this.signedOut = so);
        if (isEmpty(this.event) && this.checkNew !== 'New') {
            this.router.navigate(['roadrunner/student/']);
        }

        if (this.checkNew === 'New') {
            this.oneEvent = this.userDataContext.addRoadRunner();
            let now: Date = new Date();
            this.oneEvent.leaveDate = now;
            this.oneEvent.returnDate = now;

        } else {
            this.id = (+this.route.snapshot.params['id']);
            this.event = this.event.filter((single: RoadRunner) => single.id === this.id);
            this.oneEvent = this.event.find((single: RoadRunner) => single.id === this.id);

            if (this.oneEvent.prevSignOut === true) {
                this.tempEvent = this.oneEvent;

                this.oneEvent = this.userDataContext.addRoadRunner();
                this.clone = true;
                let now: Date = new Date();
                this.oneEvent.location = this.tempEvent.location;
                this.oneEvent.phoneNumber = this.tempEvent.phoneNumber;
                this.oneEvent.leaveDate = now;
                this.oneEvent.returnDate = now;

            }
        }
    }

    ngOnDestroy(): void {
        this.eventSub.unsubscribe();
        this.soSub.unsubscribe();
    }

    cancel(): void {

        this.oneEvent.entityAspect.rejectChanges();
        this.location.back();

    }

    save(): void {
        this.userDataContext.commit()
            .then((res) => {
                this.global.showSnackBar('Location Saved');
                this.router.navigate(['roadrunner/student/']);
            }).catch((error: Event) => {
                this.dialogService.openAlert({
                    message: 'There was an error saving your changes, please try again.',
                });
            });
    }

    delete(): void {

        this.oneEvent.entityAspect.setDeleted();

        this.userDataContext.commit()
            .then((res) => {
                this.global.showSnackBar('Location Deleted');
                this.router.navigate(['roadrunner/student/']);
            }).catch((error: Event) => {
                this.dialogService.openAlert({
                    message: 'There was an error saving your changes, please try again.',
                });
            });
    }

}
