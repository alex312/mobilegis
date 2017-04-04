import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { ApiClientService } from '../../base';

import { UserService } from './service/user.service';

import { LoginPage } from './page/user-login.component';
import { UserSettingPage } from './page/user-setting.component';
import { PasswordReSettingPage } from './page/password-resetting.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        UserSettingPage,
        LoginPage
    ],
    declarations: [
        UserSettingPage,
        PasswordReSettingPage,
        LoginPage
    ],
    entryComponents: [
        UserSettingPage,
        PasswordReSettingPage,
        LoginPage
    ],
    providers: [
        ApiClientService,
        UserService
    ]
})
export class UserModule {

}