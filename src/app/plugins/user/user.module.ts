import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { UserSettingPage } from './page/user-setting.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        UserSettingPage
    ],
    declarations: [
        UserSettingPage
    ],
    entryComponents: [
        UserSettingPage
    ],
    providers: [

    ]
})
export class UserModule {

}