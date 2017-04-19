import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MenuPage } from './page/menu.page';

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
    providers: [],
})
export class MenuModule {

}