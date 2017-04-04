import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PasswordReSettingPage } from './password-resetting.component';

@Component({
    selector: "user-setting-page",
    templateUrl: "./user-setting.component.html"
})
export class UserSettingPage {
    constructor(private _navCtrl: NavController) {

    }

    resetPassword() {
        this._navCtrl.push(PasswordReSettingPage);
    }
}