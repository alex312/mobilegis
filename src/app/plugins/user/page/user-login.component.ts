
import { Component, NgZone } from '@angular/core';
import { NavController, ToastController, Loading, LoadingController } from 'ionic-angular';

import { UserService } from '../service/user.service';
import { MessagePupopService } from '../../../base';

@Component({
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

    constructor(private navCtrl: NavController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private zone: NgZone,
        private userService: UserService,
        private popup: MessagePupopService) {

        if (userService.Current.LastUpdateTime)
            this.userName = userService.Current.UserName;
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
                    this.navCtrl.pop().then(result => {
                        this.userService.runLoginAction();
                    })
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
            // 如果在ngOnInit中显示loading，需要设置为false，否则ngOnInit执行完之后将dismiss loading。
            dismissOnPageChange: false
        });
        this.loading.present(this.loading);
    }

    stopLoading() {

        return this.loading.dismiss();

    }


    ionViewDidEnter() {

        this.userService.logout();
    }
}