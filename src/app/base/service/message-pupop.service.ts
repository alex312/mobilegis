import { Injectable } from '@angular/core';
import { AlertController, Alert, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class MessagePupopService {

    constructor(private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController) {

    }

    alert(data) {
        let alert = this.alertCtrl.create({
            title: data.title,
            subTitle: data.subTitle,
            message: data.message,
            cssClass: data.cssClass,
        })

        alert.addButton("确定");

        alert.present();
    }

    createConfirm(data) {
        let confirm = this.alertCtrl.create({
            title: data.title,
            subTitle: data.subTitle || "",
            message: data.message,
        })

        confirm.addButton({
            text: data.disagreeText || "取消",
            handler: () => {
                if (data.disagreeHandler)
                    data.disagreeHandler();
                confirm.dismiss();
            }
        })

        confirm.addButton({
            text: data.agreeText || "确定",
            handler: () => {
                if (data.agreeHandler)
                    data.agreeHandler();
                confirm.dismiss();
            }
        })
        return confirm;
    }

    confirm(data) {
        let confirm = this.alertCtrl.create({
            title: data.title,
            subTitle: data.subTitle || "",
            message: data.message,
        })

        confirm.addButton({
            text: data.disagreeText || "取消",
            handler: data.disagreeHandler || (() => { })
        })

        confirm.addButton({
            text: data.agreeText || "确定",
            handler: data.agreeHandler || (() => { })
        })

        confirm.present();
    }

    show(alert: Alert) {
        if (alert)
            alert.present();
    }
    close(alert: Alert) {
        if (alert)
            alert.dismiss();
    }

    toast(data) {
        let toast = this.toastCtrl.create({
            message: data.message,
            duration: data.duration,
        });

        toast.present();
    }
}