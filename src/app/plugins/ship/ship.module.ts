import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { ShipDetailPage } from './page/ship-detail.page';
import { VesselGroupPage } from "./page/vessel-group.page";
import { VesselGroupMemberPage } from "./page/vessel-group-member.page";

import { ShipInfoComponent } from './component/ship-info.component';
import { ShipSummaryComponent } from './component/ship-summary.component';
import { ShipArchiveComponent } from './component/ship-archive.component';
import { NearbyShipComponent } from './component/nearby-ship.component';
import { ShipDynamicComponent } from './component/ship-dynamic.component';

import { NearbyShipService } from './service/nearby-ship.service';
import { VesselGroupService } from './service/vessel-group.service';


@NgModule({
    id: "ShipModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BaseModule
    ],
    exports: [
        ShipInfoComponent,
        ShipSummaryComponent,
        ShipArchiveComponent,
        NearbyShipComponent,
        ShipDynamicComponent,

    ],
    entryComponents: [
        ShipDetailPage,
        VesselGroupPage,
        VesselGroupMemberPage
    ],
    declarations: [
        ShipInfoComponent,
        ShipSummaryComponent,
        ShipArchiveComponent,
        NearbyShipComponent,
        ShipDynamicComponent,
        ShipDetailPage,
        VesselGroupPage,
        VesselGroupMemberPage
    ],
    providers: [
        NearbyShipService,
        VesselGroupService],
})
export class ShipModule {

}