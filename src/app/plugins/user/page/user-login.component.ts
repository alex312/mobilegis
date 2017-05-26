import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';

import { UserService } from '../service/user.service';
import { MessagePopupService } from '../../../base';

@Component({
    selector: "user-login-page",
    templateUrl: './user-login.component.html'
})
export class UserLoginPage {

    logoState: any = "in";
    cloudState: any = "in";
    loginState: any = "in";
    formState: any = "in";

    userName: string;
    password: string;

    loading: Loading;

    loginSuccess: Function;
    cancelLogin: Function;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private zone: NgZone,
        private userService: UserService,
        private popup: MessagePopupService) {
        // if (userService.Current.LastUpdateTime)
        //     this.userName = userService.Current.UserName;    
    }

    login() {
        if (!this.userName || !this.password) {
            this.popup.alert({
                title: "提示",
                message: "没有填写用户名或密码"
            })
            return;
        }
        this.startLoading();
        this.userService.login(this.userName, this.password)
            .then((data) => {
                this.stopLoading();
                if (!data) {
                    this.toastPresent("用户名或密码错误");
                }
                else {
                    this.navTo();
                    this.userService.runLoginAction();
                }
            }).catch(this.handleError.bind(this));
    }

    handleError(data) {
        this.stopLoading().then((e) => {
            this.toastPresent("登录失败");
        });
    }

    toastPresent(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });

        toast.present(toast);
    }

    startLoading() {
        this.loading = this.loadingCtrl.create({
            content: "请稍后...",
            dismissOnPageChange: false
        });
        this.loading.present(this.loading);
    }

    stopLoading() {
        return this.loading.dismiss();
    }

    ionViewWillEnter() {
        if (this.navParams.data != undefined && this.navParams.data != null) {
            this.loginSuccess = this.navParams.data.loginSuccess;
            this.cancelLogin = this.navParams.data.cancelLogin;
        }
        if (this.userService.hasLogined) {
            this.navTo();
        }
    }

    navTo() {
        if (this.navCtrl.canGoBack())
            this.navCtrl.pop();
        if (this.loginSuccess !== undefined && this.loginSuccess !== null)
            this.loginSuccess();
    }
}