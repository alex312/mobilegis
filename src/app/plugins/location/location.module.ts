import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { LocationTracker } from './service/location-tracker.service';

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
    providers: [
        LocationTracker
    ],
})
export class LocationModule {

}