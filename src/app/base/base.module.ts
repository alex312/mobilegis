import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { ItemLabelComponent } from './component/item-label.component';
import { ItemButtonComponent } from './component/item-button.component';
import { ItemComponent } from './component/item.component';
import { SearchbarComponent } from './component/searchbar.component';
import { ComponentSelectorComponent } from './component/component-selector.component';
import { ShipTypeComponent } from './component/ship/ship-type.component';

import { ApiClientService } from './service/api-client.service';
import { WebGISInteractiveService } from './service/webgis-interactive.service';
import { MessagePopupService } from './service/message-popup.service';
import { ComponentSelectorService } from './service/component-selector.service';


@NgModule({
    id: "BaseModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        ItemLabelComponent,
        ItemComponent,
        ItemButtonComponent,
        SearchbarComponent,
        ComponentSelectorComponent,
        ShipTypeComponent
    ],
    entryComponents: [

    ],
    declarations: [
        ItemLabelComponent,
        ItemComponent,
        ItemButtonComponent,
        SearchbarComponent,
        ComponentSelectorComponent,
        ShipTypeComponent
    ],
})
export class BaseModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BaseModule,
            providers: [ApiClientService, WebGISInteractiveService, MessagePopupService, ComponentSelectorService]
        }
    }
}