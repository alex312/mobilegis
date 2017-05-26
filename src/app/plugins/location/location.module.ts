import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { LocationTracker } from './service/location-tracker.service';
import { ILocationConfig, Location_Config, dealConfig } from './service/config';

@NgModule({
    id: "LocationModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [

    ],
    entryComponents: [

    ],
    declarations: [

    ],
})
export class LocationModule {
    static forRoot(config: ILocationConfig): ModuleWithProviders {
        return {
            ngModule: LocationModule,
            providers: [
                { provide: Location_Config, useValue: dealConfig(config) },
                LocationTracker,
            ]
        }
    }
}