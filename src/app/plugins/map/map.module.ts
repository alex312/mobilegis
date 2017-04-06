import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { SearchModule } from '../search';
import { ShipModule } from '../ship';
import { TrafficEnvModule } from '../traffic-env';

import { MapPage } from './page/map.page';

import { SeecoolGISComponent } from './component/seecool-gis.component';
import { FeatureInfoComponent } from './component/feature-info.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchModule,
        ShipModule,
        TrafficEnvModule
    ],
    exports: [
        MapPage
    ],
    entryComponents: [
        MapPage
    ],
    declarations: [
        MapPage,
        SeecoolGISComponent,
        FeatureInfoComponent
    ],
    providers: [],
})
export class MapModule {

}