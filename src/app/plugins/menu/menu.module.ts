import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MenuPage } from './page/menu.page';
import { Menu_Config, IMenuConfig } from './service/config';

@NgModule({
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
})
export class MenuModule {
    static forRoot(menuConfig: IMenuConfig): ModuleWithProviders {
        return {
            ngModule: MenuModule,
            providers: [
                { provide: Menu_Config, useValue: menuConfig }
            ]
        }
    }
}