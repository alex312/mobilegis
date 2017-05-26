import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { ShipDynamicPage } from './page/ship-dynamic.component';
import { ShipDynamicSearchPage } from './page/ship-dynamic-search.component';
import { ShipDynamicDetailPage } from './page/ship-dynamic-detail.component';

import { PortVisitCardListComponent } from './component/port-visit/port-visit-card-list.component';
import { VesselDynamicCardListComponent } from './component/vessel/vessel-dynamic-card-list.component';
import { RawBoatDynamicCardListComponent } from './component/raw-boat/raw-boat-dynamic-card-list.component';
import { BerthStateCardListComponent } from './component/berth/berth-state-card-list.component';
import { AnchorStateCardListComponent } from './component/anchor/anchor-state-card-list.component';

import { QueryParamComponent } from './component/condition/query-param.component';

import { AnchorStateCardComponent } from './component/anchor/anchor-state-card.component';
import { BerthStateCardComponent } from './component/berth/berth-state-card.component';
import { PortVisitCardComponent } from './component/port-visit/port-visit-card.component';
import { RawBoatDynamicCardComponent } from './component/raw-boat/raw-boat-dynamic-card.component';
import { VesselDynamicCardComponent } from './component/vessel/vessel-dynamic-card.component';

import { AnchorStateDetailComponent } from './component/anchor/anchor-state-detail.component';
import { BerthStateDetailComponent } from './component/berth/berth-state-detail.component';
import { PortVisitDetailComponent } from './component/port-visit/port-visit-detail.component';
import { RawBoatDynamicDetailComponent } from './component/raw-boat/raw-boat-dynamic-detail.component';
import { VesselDynamicDetailComponent } from './component/vessel/vessel-dynamic-detail.component';

import { DynamicDataService } from './service/dynamic-data.service';

import { LoadingModule } from '../loading';


@NgModule({
    id: "ShipDynamicModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BaseModule,
        LoadingModule
    ],
    declarations: [
        ShipDynamicPage,
        ShipDynamicSearchPage,
        PortVisitCardListComponent,
        VesselDynamicCardListComponent,
        RawBoatDynamicCardListComponent,
        BerthStateCardListComponent,
        AnchorStateCardListComponent,
        QueryParamComponent,
        AnchorStateCardComponent,
        BerthStateCardComponent,
        PortVisitCardComponent,
        RawBoatDynamicCardComponent,
        VesselDynamicCardComponent,
        ShipDynamicDetailPage,
        AnchorStateDetailComponent,
        BerthStateDetailComponent,
        PortVisitDetailComponent,
        RawBoatDynamicDetailComponent,
        VesselDynamicDetailComponent
    ],
    exports: [],
    entryComponents: [
        ShipDynamicPage,
        ShipDynamicSearchPage,
        AnchorStateCardComponent,
        BerthStateCardComponent,
        PortVisitCardComponent,
        RawBoatDynamicCardComponent,
        VesselDynamicCardComponent,
        ShipDynamicDetailPage,
        AnchorStateDetailComponent,
        BerthStateDetailComponent,
        PortVisitDetailComponent,
        RawBoatDynamicDetailComponent,
        VesselDynamicDetailComponent
    ],
    providers: [DynamicDataService]
})
export class ShipDynamicModule {

}


