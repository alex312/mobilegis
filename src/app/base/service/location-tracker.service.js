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
var ionic_native_1 = require('ionic-native');
//import {DeviceInfo} from '../../util/utils';
var device_info_1 = require('../util/device-info');
// import {ApiClientService} from '../../service/api-client.service'
var api_client_service_1 = require('./api-client.service');
//import {UserService} from '../../user/service/user.service';
var location_info_1 = require('./location-info');
// import {PupopMessageManager} from '../../pupopMessage/popup-message-manager';
var message_pupop_service_1 = require('./message-pupop.service');
var LocationTrackerService = (function () {
    function LocationTrackerService(platofrm, apiClient, popup) {
        this.platofrm = platofrm;
        this.apiClient = apiClient;
        this.popup = popup;
        this.locationStorageUrl = "http://192.168.13.35/GPSLocation/api/Location"; //TODO:修改url
        this.isStarted = false;
        this.config = {
            debug: false,
            desiredAccuracy: 10,
            stationaryRadius: 5,
            distanceFilter: 0,
            maxLocations: 1000,
            // Android only section
            locationProvider: 0,
            interval: 6 * 1000,
            fastestInterval: 5 * 1000,
            activitiesInterval: 6 * 1000,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            notificationIconColor: '#FEDD1E',
            notificationIconLarge: 'mappointer_large',
            notificationIconSmall: 'mappointer_small'
        };
        // this.setLocationTrackerEnable();
    }
    LocationTrackerService.prototype.startTrack = function () {
        if (!this.isStarted) {
            this.isStarted = true;
            console.log("startTrack Location");
            ionic_native_1.BackgroundGeolocation.configure(this.savePosition.bind(this), this.handlerError, this.config);
            ionic_native_1.BackgroundGeolocation.start();
            console.log("end startTrack Location");
        }
    };
    LocationTrackerService.prototype.stopTrack = function () {
        this.isStarted = false;
        if (this.needFinish()) {
            ionic_native_1.BackgroundGeolocation.finish();
        }
        ionic_native_1.BackgroundGeolocation.stop();
    };
    LocationTrackerService.prototype.setLocationTrackerEnable = function () {
        var _this = this;
        ionic_native_1.BackgroundGeolocation.isLocationEnabled()
            .then(function (enabled) {
            if (!enabled) {
                _this.popup.confirm({
                    title: "提示",
                    message: "GPS未开启，是否马上设置？",
                    agreeText: "设置",
                    agreeHandler: function () { return ionic_native_1.BackgroundGeolocation.showLocationSettings(); },
                    disagreeHandler: function () {
                        _this.popup.toast({
                            message: '只有在开启GPS后才能正常记录轨迹,请开启GPS',
                            duration: 2000
                        });
                    }
                });
            }
        })
            .catch(this.handlerError.bind(this));
    };
    LocationTrackerService.prototype.savePosition = function (location) {
        var date = new Date();
        console.log(" [js] BackgroundGeolocation callback:" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds);
        console.log(location);
        var locationInfo = this.createLocationInfo(location);
        this.apiClient.post(this.locationStorageUrl, locationInfo);
        if (this.needFinish())
            ionic_native_1.BackgroundGeolocation.finish(); // FOR IOS ONLY
    };
    LocationTrackerService.prototype.createLocationInfo = function (location) {
        var locationInfo = new location_info_1.LocationInfo();
        locationInfo.Accuracy = location.accuracy;
        locationInfo.Altitude = location.altitude;
        locationInfo.Bearing = location.bearing;
        locationInfo.DeviceUUID = device_info_1.DeviceInfo.UUID();
        locationInfo.Latitude = location.latitude;
        locationInfo.LocationProvider = location.locationProvider;
        locationInfo.Longitude = location.longitude;
        locationInfo.Provider = location.provider;
        locationInfo.Speed = location.speed;
        locationInfo.DataTime = location.time;
        // locationInfo.UserId = this.user.Current.UserId;
        // locationInfo.Name = this.user.Current.UserName;
        return locationInfo;
    };
    LocationTrackerService.prototype.handlerError = function (error) {
        console.log('BackgroundGeolocation error：' + error);
    };
    LocationTrackerService.prototype.needFinish = function () {
        return this.platofrm.is("ios");
    };
    LocationTrackerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform, api_client_service_1.ApiClientService, message_pupop_service_1.MessagePupopService])
    ], LocationTrackerService);
    return LocationTrackerService;
}());
exports.LocationTrackerService = LocationTrackerService;
