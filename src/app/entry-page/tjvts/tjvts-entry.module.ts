import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from "../../base";
import { LoadingModule } from '../../plugins/loading';
import { MapModule } from '../../plugins/map';
import { ArticleModule } from "../../plugins/article"
import { ShipModule } from '../../plugins/ship';

import { HomePage } from './home';
import { TabsPage } from './tabs';


@NgModule({
    id: "TJVTSEntryModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BaseModule,
        LoadingModule,
        MapModule,
        ArticleModule,
        ShipModule
    ],
    exports: [

    ],
    entryComponents: [
        HomePage, TabsPage
    ],
    declarations: [
        HomePage, TabsPage
    ],
    providers: [],
})
export class TJVTSEntryModule {

}
