import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { TrafficEnvDetailComponent } from './component/traffic-env-detail.component';
import { TrafficEnvInfoComponent } from './component/traffic-env-info.component';
import { TrafficEnvSummaryComponent } from './component/traffic-env-summary.component';

import { TrafficEnvService } from './service/traffic-env.service';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BaseModule
    ],
    exports: [
        TrafficEnvDetailComponent,
        TrafficEnvInfoComponent,
        TrafficEnvSummaryComponent
    ],
    entryComponents: [

    ],
    declarations: [
        TrafficEnvDetailComponent,
        TrafficEnvInfoComponent,
        TrafficEnvSummaryComponent
    ],
    providers: [TrafficEnvService],
})
export class TrafficEnvModule {

}