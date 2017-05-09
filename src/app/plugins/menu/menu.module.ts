import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MenuPage } from './page/menu.page';
import { IMenuConfig, Menu_Config } from './service/config';

@NgModule({
    id: "MenuModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        MenuPage
    ],
    entryComponents: [
        MenuPage
    ],
    declarations: [
        MenuPage
    ],
    providers: [],
})
export class MenuModule {
    static forRoot(menuConfig: IMenuConfig): ModuleWithProviders {
        return {
            ngModule: MenuModule,
            providers: [
                { provide: Menu_Config, useValue: menuConfig },
            ]
        }
    }
}