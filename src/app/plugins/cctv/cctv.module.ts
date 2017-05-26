import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { CCTVDataService } from './service/cctv-data.service';
import { ICCTVConfig, CCTV_Config, dealConfig } from './service/config';

import { CCTVComponent } from './page/cctv.component';

// import { CCTVNodeListComponent } from './component/cctv-node-list.component';

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
    ],
})
export class CCTVModule {
    static forRoot(config: ICCTVConfig): ModuleWithProviders {
        return {
            ngModule: CCTVModule,
            providers: [
                { provide: CCTV_Config, useValue: dealConfig(config) },
                CCTVDataService
            ]
        }
    }
}