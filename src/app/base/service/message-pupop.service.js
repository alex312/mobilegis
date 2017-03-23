"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var MessagePupopService = (function () {
    function MessagePupopService(alertCtrl, loadingCtrl, toastCtrl) {
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
    }
    MessagePupopService.prototype.alert = function (data) {
        var alert = this.alertCtrl.create({
            title: data.title,
            subTitle: data.subTitle,
            message: data.message,
            cssClass: data.cssClass,
        });
        alert.addButton("确定");
        alert.present();
    };
    MessagePupopService.prototype.confirm = function (data) {
        var confirm = this.alertCtrl.create({
            title: data.title,
            subTitle: data.subTitle || "",
            message: data.message,
        });
        confirm.addButton({
            text: data.disagreeText || "取消",
            handler: data.disagreeHandler || (function () { })
        });
        confirm.addButton({
            text: data.agreeText || "确定",
            handler: data.agreeHandler || (function () { })
        });
        confirm.present();
    };
    MessagePupopService.prototype.toast = function (data) {
        var toast = this.toastCtrl.create({
            message: data.message,
            duration: data.duration,
        });
        toast.present();
    };
    MessagePupopService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ionic_angular_1.AlertController, ionic_angular_1.LoadingController, ionic_angular_1.ToastController])
    ], MessagePupopService);
    return MessagePupopService;
}());
exports.MessagePupopService = MessagePupopService;
