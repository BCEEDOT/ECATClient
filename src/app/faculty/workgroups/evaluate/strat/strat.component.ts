import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TdDialogService, TdLoadingService } from "@covalent/core";

import { ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from "rxjs";
import { DragulaService } from "ng2-dragula";

import { GlobalService } from "../../../../core/services/global.service";
import { WorkGroup, CrseStudentInGroup, FacStratResponse } from "../../../../core/entities/faculty";
import { SpProviderService } from "../../../../provider/sp-provider/sp-provider.service";
import { FacultyDataContextService } from "../../../services/faculty-data-context.service";
import { FacWorkgroupService } from "../../../services/facworkgroup.service";

@Component({
    selector: 'strat',
    templateUrl: './strat.component.html',
    styleUrls: ['./strat.component.scss']
})
export class StratComponent implements OnInit, OnDestroy {

    groupMembers: CrseStudentInGroup[];
    unstratted: FacStratResponse[] = [];
    stratted: FacStratResponse[] = [];
    groupCount: number;
    workGroupId: number;
    courseId: number;
    readOnly: boolean = false;
    roSub: Subscription;
    atSub: Subscription;
    dragSub: Subscription;
    showUnstrat: boolean = false;

    constructor(private spProvider: SpProviderService, private facultyDataContext: FacultyDataContextService, private loadingService: TdLoadingService,
        private dialogService: TdDialogService, private route: ActivatedRoute, private facWorkGroupService: FacWorkgroupService,
        private global: GlobalService,
        private dragulaService: DragulaService, ) {

        this.route.params.subscribe(params => {
            this.workGroupId = +params['wrkGrpId'];
            this.courseId = +params['crsId'];

        });

        dragulaService.drop.subscribe((value) => {
            console.log(`drop: ${value[0]}`);
            this.onDrop(value.slice(1));
        });
    }

    @Input() members: CrseStudentInGroup[];

    ngOnInit() {

        this.atSub = this.facWorkGroupService.stratTabActive$.subscribe(stratTabActive => {

            console.log('It triggred a change');
            console.log('This is the stratTabActive');
            console.log(stratTabActive);

            if (stratTabActive === true) {
                this.createStratEntities()
                this.activate();
            }

        });

        this.roSub = this.facWorkGroupService.readOnly$.subscribe(status => {
            console.log('It is in the readonly');
            this.readOnly = status;
            this.activate();
        });

    }

    createStratEntities(): void {
        this.groupMembers.forEach(gm => {
            this.facultyDataContext.getSingleStrat(this.courseId, this.workGroupId, gm.studentId);
        });
    }

    ngOnDestroy() {
        this.roSub.unsubscribe();
        this.atSub.unsubscribe();
        this.facWorkGroupService.stratTabActive(false);
        // if (this.facultyDataContext.hasChanges()) {
        //     this.facultyDataContext.rollback();
        // }
        this.dragSub.unsubscribe();
    }


    activate() {
        this.groupMembers = this.members;

        this.unstratted = this.groupMembers[0].workGroup.facStratResponses.filter(fstr => {
            if (fstr.stratPosition === 0) { return true; }
        }).sort((a: FacStratResponse, b: FacStratResponse) => {
            if (a.studentAssessee.studentProfile.person.lastName < b.studentAssessee.studentProfile.person.lastName) { return -1; }
            if (a.studentAssessee.studentProfile.person.lastName > b.studentAssessee.studentProfile.person.lastName) { return 1; }
            if (a.studentAssessee.studentProfile.person.firstName < b.studentAssessee.studentProfile.person.firstName) { return -1; }
            if (a.studentAssessee.studentProfile.person.firstName > b.studentAssessee.studentProfile.person.firstName) { return 1; }
            return 0;
        });

        this.stratted = this.groupMembers[0].workGroup.facStratResponses.filter(fstr => {
            if (fstr.stratPosition !== 0) { return true; }
        }).sort((a: FacStratResponse, b: FacStratResponse) => {
            if (a.stratPosition < b.stratPosition) { return -1; }
            if (a.stratPosition > b.stratPosition) { return 1; }
            return 0;
        });

        if (this.unstratted.length > 0) {
            this.showUnstrat = true;
        } else {
            this.showUnstrat = false;
        }

        this.groupCount = this.groupMembers.length;
        this.readOnly = this.facWorkGroupService.readOnly$.value;
        //this.evaluateStrat(true);

        this.dragSub = this.dragulaService.drop.subscribe((value) => {
            this.onDrop(value.slice(1));
        });
    }

    private onDrop(args) {

        console.log(args);

        for (var i = 0; i < this.stratted.length; i++) {
            this.stratted[i].stratPosition = i + 1;


            //Fix for safari not repainting strat positions 
            //stopped working for some reason...
            // let sel = document.getElementById(this.stratted[i].assesseePersonId.toString());
            // sel.style.display = 'none';
            // sel.offsetHeight;
            // sel.style.display = '';
        }

        if (this.showUnstrat && this.unstratted.length === 0) {
            this.showUnstrat = false;
        }
    }

    cancel() {
        this.dialogService.openConfirm({
            message: 'Are you sure you want to cancel and discard your changes?',
            title: 'Unsaved Changed',
            acceptButton: 'Yes',
            cancelButton: 'No'
        }).afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.loadingService.register();
                this.groupMembers.forEach(gm => {
                    gm.facultyStrat.entityAspect.rejectChanges();
                });

                this.unstratted = [];
                this.stratted = [];
                this.loadingService.resolve();
                this.createStratEntities();
                this.activate();
                // if (this.groupMembers[0].workGroup.facStratResponses.length > 0){
                //     this.stratted = this.groupMembers[0].workGroup.facStratResponses.sort((a: FacStratResponse, b: FacStratResponse) => {
                //         if (a.stratPosition < b.stratPosition) {return -1;}
                //         if (a.stratPosition > b.stratPosition) {return 1;}
                //         return 0;
                //     });
                //     for (var i = 0; i < this.stratted.length; i++) {
                //         this.stratted[i].stratPosition = i + 1;
                //     }
                // } else {
                //     this.stratted = [];
                //     this.activate();
                // }

                this.global.showSnackBar('Changes Discarded');
                //this.location.back();
            }
        });
    }

    isComplete(): boolean {
        return this.unstratted.length === 0;
        // let invalidStrats = this.groupMembers.some(gm => !gm.stratIsValid);
        // let isDirty = this.groupMembers.some(gm => gm.proposedStratPosition !== null);

        // if (!isDirty) {
        //     return true;
        // }

        // if (invalidStrats) {
        //     return true;
        // }

        // return false;

    }

    isDirty(): boolean {
        if (this.stratted.length > 0) {
            return this.stratted.some(fstrat => fstrat.entityAspect.entityState.isAddedModifiedOrDeleted());
        }

        return false;
    }

    evaluateStrat(force?: boolean): void {
        this.spProvider.evaluateStratification(true, force);
    }

    saveChanges(): void {
        this.loadingService.register();
        const that = this;
        //this.evaluateStrat(true);

        //const hasErrors = this.groupMembers
        //.some(gm => !gm.stratIsValid);

        // if (hasErrors) {
        //     this.loadingService.resolve();
        //     this.dialogService.openAlert({
        //         message: 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving'
        //     });
        // } else {

        // const gmWithChanges = this.groupMembers
        //     .filter(gm => gm.proposedStratPosition !== null);

        // const changeSet = [] as Array<number>;

        // gmWithChanges.forEach(gm => {
        //     const stratResponse = this.facultyDataContext.getSingleStrat(this.courseId, this.workGroupId, gm.studentId);
        //     stratResponse.stratPosition = gm.proposedStratPosition;
        //     changeSet.push(gm.studentId);
        // });

        this.spProvider.save().then(() => {
            this.loadingService.resolve();
            this.groupMembers
                //.filter(gm => changeSet.some(cs => cs === gm.studentId))
                .forEach(gm => {
                    gm.updateStatusOfStudent();
                    gm.stratValidationErrors = [];
                    gm.stratIsValid = true;
                    gm.proposedStratPosition = null;
                });
            this.facWorkGroupService.stratComplete(true);
            this.activate();
            this.global.showSnackBar('Success, Strats Updated!');
        }).catch((error) => {
            this.loadingService.resolve();
            this.dialogService.openAlert({
                message: error,
                title: 'Save Error'
            })
        })

        //}
    }

}
