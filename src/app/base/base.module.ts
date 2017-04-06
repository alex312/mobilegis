import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { ItemLabelComponent } from './component/item-label.component';
import { ItemButtonComponent } from './component/item-button.component';
import { ItemComponent } from './component/item.component';

import { ApiClientService } from './service/api-client.service';
import { WebGISInteractiveService } from './service/webgis-interactive.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        ItemLabelComponent,
        ItemComponent,
        ItemButtonComponent
    ],
    entryComponents: [

    ],
    declarations: [
        ItemLabelComponent,
        ItemComponent,
        ItemButtonComponent
    ],
    providers: [ApiClientService, WebGISInteractiveService],
})
export class BaseModule {

}