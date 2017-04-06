import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from 'ionic-angular';

import { ApiClientService } from '../../base';

import { ShipDynamicPage } from './page/ship-dynamic.component';

import { PortVisitCardListComponent } from './component/port-visit-card-list.component';
import { VesselDyanmicCardListComponent } from './component/vessel-dynamic-card-list.component';
import { RawBoatDynamicCardListComponent } from './component/raw-boat-dynamic-card-list.component';
import { BerthStateCardListComponent } from './component/berth-state-card-list.component';
import { AnchorStateCardListComponent } from './component/anchor-state-card-list.component';
import { QueryParamComponent } from './component/query-param.component';

import { DynamicDataService } from './service/dynamic-data.service';

import { LoadingModule } from '../loading';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoadingModule
    ],
    declarations: [
        ShipDynamicPage,
        PortVisitCardListComponent,
        VesselDyanmicCardListComponent,
        RawBoatDynamicCardListComponent,
        BerthStateCardListComponent,
        AnchorStateCardListComponent,
        QueryParamComponent
    ],
    exports: [ShipDynamicPage],
    entryComponents: [ShipDynamicPage],
    providers: [DynamicDataService, ApiClientService]
})
export class ShipDynamicModule {

}


