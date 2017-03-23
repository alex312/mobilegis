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
var map_1 = require('../../map');
var group_1 = require('../data/group');
var GroupComponent = (function () {
    function GroupComponent(_nav) {
        this._nav = _nav;
        this.IconName = 'arrow-down';
    }
    GroupComponent.prototype.ngOnInit = function () {
        this.changeIcon(this.Group.Hidden);
    };
    GroupComponent.prototype.HideGroup = function (group) {
        group.hidden = !group.hidden;
        this.changeIcon(group.hidden);
    };
    GroupComponent.prototype.LocateShip = function (alarm) {
        var uid = "shipLayer:" + alarm.TrackId;
        console.log(uid);
        this._nav.push(map_1.MapPage, { selectedUid: uid });
    };
    GroupComponent.prototype.changeIcon = function (hidden) {
        this.IconName = hidden ? 'arrow-dropdown' : 'arrow-dropup';
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', group_1.Group)
    ], GroupComponent.prototype, "Group", void 0);
    GroupComponent = __decorate([
        core_1.Component({
            selector: 'alarm-group',
            templateUrl: 'build/plugins/alarm/component/group.component.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], GroupComponent);
    return GroupComponent;
}());
exports.GroupComponent = GroupComponent;
