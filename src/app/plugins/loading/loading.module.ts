import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { LoadingComponent } from './component/loading.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        LoadingComponent
    ],
    exports: [
        LoadingComponent,
    ],
    entryComponents: [

    ],

    providers: [],
})
export class LoadingModule {

}