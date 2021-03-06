import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { ApiClientService } from '../../base';

import { UserService } from './service/user.service';

import { UserLoginPage } from './page/user-login.component';
import { UserSettingPage } from './page/user-setting.component';
import { PasswordReSettingPage } from './page/password-resetting.component';

@NgModule({
    id: "UserModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
    ],
    declarations: [
        UserSettingPage,
        PasswordReSettingPage,
        UserLoginPage
    ],
    entryComponents: [
        UserSettingPage,
        PasswordReSettingPage,
        UserLoginPage
    ],
    providers: [
        ApiClientService
        // UserService
    ]
})
export class UserModule {

}