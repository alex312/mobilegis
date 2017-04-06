import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { ShipInfoComponent } from './component/ship-info.component';
import { ShipSummaryComponent } from './component/ship-summary.component';
import { ShipArchiveComponent } from './component/ship-archive.component';
import { NearbyShipComponent } from './component/nearby-ship.component';
import { ShipDynamicComponent } from './component/ship-dynamic.component';

import { NearbyShipService } from './service/nearby-ship.service';
import { VesselGroupService } from './service/vessel-group.service';


@NgModule({
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
        ShipDynamicComponent
    ],
    entryComponents: [

    ],
    declarations: [
        ShipInfoComponent,
        ShipSummaryComponent,
        ShipArchiveComponent,
        NearbyShipComponent,
        ShipDynamicComponent
    ],
    providers: [
        NearbyShipService,
        VesselGroupService],
})
export class ShipModule {

}