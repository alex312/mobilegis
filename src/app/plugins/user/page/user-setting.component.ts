import { Component } from '@angular/core';
import { NavController, Tab } from 'ionic-angular';

import { PasswordReSettingPage } from './password-resetting.component';
import { UserLoginPage } from './user-login.component';
import { UserService } from '../service/user.service';

@Component({
    selector: "user-setting-page",
    templateUrl: "./user-setting.component.html"
})
export class UserSettingPage {

    userName: string;
    constructor(private _navCtrl: NavController,
        private _tab: Tab,
        private _user: UserService
    ) {
        this._user.autoLogin().then(success => {
            if (!success)
                this.relogin();
            else
                this.userName = this._user.Current.RealName;
        })
    }

    resetPassword() {
        this._navCtrl.push(PasswordReSettingPage);
    }

    relogin() {
        this._tab.setRoot(UserLoginPage, {
            loginSuccess: () => {
                this._tab.setRoot(UserSettingPage);
            }
        });
    }
}