import { LineChartModule } from '@swimlane/ngx-charts/release';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
    CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentMenuModule, CovalentChipsModule, CovalentDataTableModule, CovalentMessageModule,
} from '@covalent/core';
import {
    MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
    MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
    MatTabsModule, MatSidenavModule, MatTooltipModule, MatCheckboxModule, MatRadioModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatChipsModule, MatRippleModule, MatExpansionModule
} from '@angular/material';
import { BarChartModule, LineChartComponent, PieChartModule } from '@swimlane/ngx-charts';
import { DragulaModule } from 'ng2-dragula';

import { LoggerService } from './services/logger.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
    imports: [
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTabsModule,
        MatSidenavModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatRadioModule,
        // MatCoreModule,
        // MatAutocompleteModule,
        MatProgressBarModule,
        MatSliderModule,
        MatChipsModule,
        MatGridListModule,
        MatRippleModule,
        MatExpansionModule,
        CovalentCommonModule,
        CovalentLayoutModule,
        CovalentMediaModule,
        CovalentExpansionPanelModule,
        CovalentMessageModule,
        // CovalentFileModule,
        // CovalentStepsModule, 
        CovalentLoadingModule,
        CovalentDialogsModule,
        CovalentSearchModule,
        CovalentPagingModule,
        // CovalentNotificationsModule, 
        CovalentMenuModule,
        CovalentChipsModule,
        CovalentDataTableModule,
        // CovalentJsonForMatterModule,
        // CovalentHighlightModule,
        // CovalentMarkdownModule,
        DragulaModule,
        // NgxChartsModule
        BarChartModule, LineChartModule, PieChartModule,

    ],
    declarations: [
        PagenotfoundComponent],
    exports: [
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTabsModule,
        MatSidenavModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatRadioModule,
        // MatCoreModule, 
        // MatAutocompleteModule,
        MatProgressBarModule,
        MatSliderModule,
        MatChipsModule,
        MatGridListModule,
        MatRippleModule,
        MatExpansionModule,
        CovalentCommonModule,
        CovalentLayoutModule,
        CovalentMediaModule,
        CovalentExpansionPanelModule,
        // CovalentFileModule,
        // CovalentStepsModule, 
        CovalentLoadingModule,
        CovalentDialogsModule,
        CovalentSearchModule,
        CovalentPagingModule,
        // CovalentNotificationsModule, 
        CovalentMenuModule,
        CovalentChipsModule,
        CovalentDataTableModule,
        // CovalentJsonForMatterModule,
        // CovalentHighlightModule, 
        CovalentMessageModule,
        // CovalentMarkdownModule,
        DragulaModule,
        BarChartModule, LineChartModule, PieChartModule,
    ],
    providers: [
        LoggerService,
    ]
})

export class SharedModule { }