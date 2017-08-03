import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as _ from "lodash";

import { CogEcpeResult } from "../../../core/entities/user";
import { CogResultsService } from "../../services/cog-results.service";

@Component({
    selector: 'ecpe-result',
    templateUrl: './ecpe-result.component.html',
    styleUrls: ['./ecpe-result.component.scss']
})
export class EcpeResultComponent implements OnInit {

    protected ecpeResult: CogEcpeResult;
    protected ecpeResultText: string;

    //TODO: Update eCPE mean and Standard Deviation values periodically based on new assessment data
    private ecpeMean = 473;
    private ecpeSD = 124;

    constructor(private cogResultsService: CogResultsService, private router: Router) { }

    ngOnInit() {
        this.cogResultsService.cogEcpeResult$.subscribe(res => {
            this.ecpeResult = res;
        });

        if (_.isEmpty(this.ecpeResult)) {
            this.router.navigate(['/cognitives']);
        }

        this.calcEcpeResult(this.ecpeResult);
    }

    private calcEcpeResult(ecpeResult: CogEcpeResult): void {
        if (this.ecpeResult.outcome < this.ecpeMean) {
            //Strongly Adaptive
            if (this.ecpeResult.outcome <= (this.ecpeMean - (this.ecpeSD * 2))) {
                this.ecpeResultText = "Strongly Adaptive";
                //Moderately Adaptive
            } else if (this.ecpeResult.outcome <= (this.ecpeMean - this.ecpeSD)) {
                this.ecpeResultText = "Moderately Adaptive";
                //Mildly Adaptive
            } else {
                this.ecpeResultText = "Mildly Adaptive";
            }
        } else if (this.ecpeResult.outcome > this.ecpeMean) {
            //Midly Innovative
            if (this.ecpeResult.outcome < (this.ecpeMean + this.ecpeSD)) {
                this.ecpeResultText = "Mildly Innovative";
                //Moderately Innovative
            } else if (this.ecpeResult.outcome < (this.ecpeMean + (this.ecpeSD * 2))) {
                this.ecpeResultText = "Moderately Innovative";
                //Strongly Innovative
            } else {
                this.ecpeResultText = "Strongly Innovative";
            }
        }
    }//end calcEcpeResult

}
