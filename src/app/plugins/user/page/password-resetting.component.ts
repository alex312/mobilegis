import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { UserService } from '../service/user.service';

@Component({
    selector: 'password-resetting-page',
    templateUrl: './password-resetting.component.html'
})
export class PasswordReSettingPage {
    oldPwd: string;
    newPwd: string;
    newPwdConfirm: string;

    errorMsg = "";

    constructor(
        private _user: UserService,
        private _navCtrl: NavController
    ) {

    }

    changePwd() {
        if (this.pwdIsEmpty(this.oldPwd)) {
            this.errorMsg = "请填写原密码";
            return;
        }
        if (this.pwdIsEmpty(this.newPwd)) {
            this.errorMsg = "请填写新密码";
            return;
        }
        if (this.pwdIsEmpty(this.newPwdConfirm)) {
            this.errorMsg = "请在输入一次新密码";
            return;
        }
        if (this.newPwd !== this.newPwdConfirm) {
            this.errorMsg = "两次输入的新密码不一致";
            return;
        }

        this._user.changePwd(this.oldPwd, this.newPwd);
        this._navCtrl.pop();
    }

    pwdIsEmpty(pwd) {
        return (pwd === undefined || pwd === null || pwd === "");
    }
}