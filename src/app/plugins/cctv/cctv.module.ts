import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { CCTVDataService } from './service/cctv-data.service';

import { CCTVComponent } from './page/cctv.component';

import { CCTVNodeListComponent } from './component/cctv-node-list.component';

@NgModule({
    id: "CCTVModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [

    ],
    entryComponents: [
        CCTVComponent
    ],
    declarations: [
        CCTVComponent,
        CCTVNodeListComponent
    ],
    providers: [
        CCTVDataService
    ],
})
export class CCTVModule {

}