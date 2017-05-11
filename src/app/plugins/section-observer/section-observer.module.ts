import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { SectionServerChartService } from './service/section-observer-chart.service';
import { SectionObserverService } from './service/section-observer.service';

import { SectionObserverPage } from "./page/section-observer.page";
import { SectionObserverChartPage } from "./page/section-observer-chart.page";

@NgModule({
    id: "SectionObserverModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [

    ],
    entryComponents: [
        SectionObserverPage,
        SectionObserverChartPage
    ],
    declarations: [
        SectionObserverPage,
        SectionObserverChartPage
    ],
    providers: [
        SectionServerChartService,
        SectionObserverService
    ],
})
export class SectionObserverModule {

}