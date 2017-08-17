import { Component, OnInit } from '@angular/core'
import { RoadrunnerService } from '../services/roadrunner.service';
import { UserDataContext } from "../../core/services/data/user-data-context.service";
import { RoadRunner } from "../../core/entities/user";
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Location } from '@angular/common'

import { isEmpty} from "lodash"; 

import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './roadrunner-details.component.html',
    styleUrls: ['./roadrunner-details.component.scss']

})

export class RoadrunnerDetailsComponent implements OnInit {

    event: RoadRunner[];
    leavedate: string;
    oneEvent: RoadRunner;
    tempEvent: RoadRunner;
    id: number;
    checkNew: string;
    isNew: boolean;
    startCheck: boolean = false;
    endCheck: boolean = false;
    touch: boolean = true;
    minDate = new Date(2017, 0, 1);
    maxDate = new Date(2020, 0, 1);
    clone: boolean = false;


    dateForm: FormGroup;

    constructor(private roadRunnerService: RoadrunnerService,
        private userDataContext: UserDataContext,
        private route: ActivatedRoute,
        private router: Router,
        private snackBarService: MdSnackBar,
        private location: Location,
    ) {

    }

    ngOnInit() {

        this.roadRunnerService.roadRunnerData$.subscribe((roadRunnerData: RoadRunner[]) => {
            console.log("roadrunner update")
            this.event = roadRunnerData;
        })

        

        this.checkNew = (this.route.snapshot.params['id']);

        if(isEmpty(this.event) && this.checkNew != "New"){
            this.router.navigate(['roadrunnerStudent/']);
        }


        if (this.checkNew === "New") {
            this.oneEvent = this.userDataContext.addRoadRunner();
            var today = new Date();
            this.oneEvent.leaveDate = today;
            this.oneEvent.returnDate = today;

        } else {
            this.id = (+this.route.snapshot.params['id']);
            this.event = this.event.filter(single => single.id === this.id);
            this.oneEvent = this.event.find(single => single.id === this.id);

            if (this.oneEvent.prevSignOut === true) {
                this.tempEvent = this.oneEvent;

                this.oneEvent = this.userDataContext.addRoadRunner();
                this.clone = true;
                var today = new Date();
                this.oneEvent.location = this.tempEvent.location;
                this.oneEvent.phoneNumber = this.tempEvent.phoneNumber;
                this.oneEvent.leaveDate = today;
                this.oneEvent.returnDate = today;

            }
        }
    }

    cancel() {

        this.oneEvent.entityAspect.rejectChanges();
        this.location.back();

    }

    save() {
        this.userDataContext.commit()
            .then((res) => {
                console.log('check roadrunner database');
                this.snackBarService.open('Roadrunner Data Saved', 'Dismiss');
                this.router.navigate(['roadrunnerStudent/']);
            })
    }

    delete() {

        this.oneEvent.entityAspect.setDeleted();

        this.userDataContext.commit()
            .then((res) => {
                console.log('check roadrunner database');
                this.router.navigate(['roadrunnerStudent/']);
            })
    }

}
