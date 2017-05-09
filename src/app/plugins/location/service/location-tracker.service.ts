import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BackgroundGeolocation, Geolocation } from 'ionic-native';

import { DeviceInfo, ApiClientService, MessagePupopService } from '../../../base';
import { UserService } from '../../user/service/user.service';

import { LocationInfo } from '../data/location-info';

@Injectable()
export class LocationTracker {

    private _geolocationWather;
    private _locationEnable: boolean;
    private _userEnableTrack: boolean = true;
    private _locationStorageUrl: string = "api/Location";
    private _isStarted = false;
    private _config = {
        debug: false,
        desiredAccuracy: 10,
        stationaryRadius: 0,
        distanceFilter: 0,
        maxLocations: 1000,
        stopOnTerminate: false,
        locationProvider: 0,
        interval: 1 * 1000,
        notificationTitle: '位置跟踪',
        notificationText: '开启',
        activityType: "AutomotiveNavigation",
    };

    private _options = {
        timeout: 3 * 1000,
        enableHighAccuracy: true
    }

    constructor(private platofrm: Platform, private user: UserService, private apiClient: ApiClientService, private popup: MessagePupopService) {
        this._gpsWeakRemindTime = Date.now();
    }

    init() {
        this.startWatchLocationMode();
        this.initLocationMode();
        this.gpsStateWatch();
        //console.log("init: locationEnable = " + this._locationEnable, this._geolocationWather);
    }

    enableTrack() {
        this._userEnableTrack = true;
        this.openLocation();
    }

    disenableTrack() {
        this._userEnableTrack = true;
    }

    private startWatchLocationMode() {
        BackgroundGeolocation.watchLocationMode()
            .then(enable => {
                //console.log("user change location mode to : " + enable);
                this._locationEnable = enable;
                this.startTrack();
            })
            .catch(this.handlerError.bind(this));
    }

    private initLocationMode() {
        BackgroundGeolocation.isLocationEnabled()
            .then(enable => {
                this._locationEnable = !!enable;
            })
            .catch(this.handlerError.bind(this));
    }

    private _isOpeningLocation;
    openLocation() {
        //console.log("openLocation");

        if (!this.isEnableTrack()) {
            this._isOpeningLocation = true;
            this.popup.confirm({
                title: "提示",
                message: "GPS功能未开启，是否马上设置？",
                agreeText: "设置",
                backdropDismiss: true,
                agreeHandler: () => {
                    if (!this._locationEnable)
                        BackgroundGeolocation.showLocationSettings();
                    this._userEnableTrack = true;
                    this._isOpeningLocation = false;
                },
                disagreeHandler: () => {
                    // this.popup.toast({
                    //     message: '只有在开启定位功能后才能正常记录轨迹,请开启定位功能',
                    //     duration: 2000
                    // });
                    this._userEnableTrack = true;
                    this._isOpeningLocation = false;
                }
            });
        }
    }




    isEnableTrack() {
        return this._locationEnable && this._userEnableTrack;
    }

    startTrack() {
        this.stopTrack();
        if (this.isEnableTrack() && !this._isStarted) {
            this._isStarted = true;
            //console.log("start Track Location");
            BackgroundGeolocation.configure(this.savePosition.bind(this), this.handlerError, this._config);
            BackgroundGeolocation.start();


            this.getAndSaveCurrentPosition();

            this.createPositionWather();
            //console.log("end startTrack Location");
        }
    }

    stopTrack() {
        //console.log("stop track Location");
        this._isStarted = false;
        BackgroundGeolocation.stop();
        BackgroundGeolocation.deleteAllLocations();
        !this._geolocationWather || this._geolocationWather.unsubscribe();
        this._geolocationWather = null;
    }

    private createPositionWather() {
        this._geolocationWather = Geolocation.watchPosition(this._options).subscribe((p: any) => {
            if (p.code === undefined) {
                // if p is Geoposition
                this.savePosition(p.coords, p.timestamp);
            }
            else {
                // if p is PositionError
                console.log(p.code, p.message);
                // this.popup.toast({
                //     message: `${p.code},${p.message}`,
                //     duration: 6 * 1000
                // });
            }

        });
    }

    private _lastLocationReceiveTime: number;
    private _lastUpdateTime: number;
    private _currentLocation;
    private savePosition(location, timestamp?) {
        this._lastLocationReceiveTime = Date.now();
        //console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds(), timestamp, location);
        let locationInfo = this.createLocationInfo(location);
        if (timestamp)
            locationInfo.DataTime = timestamp;
        this._currentLocation = locationInfo;

        if (Date.now() - this._lastUpdateTime <= 500) {
            return;
        }
        this.sendPosition(locationInfo, false);
    }

    private sendPosition(locationInfo, cached) {
        if (this._userEnableTrack) {
            if (cached)
                locationInfo.Provider = "cached";
            this.apiClient.post(this._locationStorageUrl, locationInfo).then(result => {
                // console.log("send location success", result)
                this._lastUpdateTime = Date.now();
            }).catch(error => {
                console.log("send location failed", error);
            });

            if (this.needFinish())
                BackgroundGeolocation.finish(); // FOR IOS ONLY
        }
    }

    private _gpsWeakRemindTime = Date.now();
    private gpsStateWatch() {
        setTimeout(() => {
            if (this.isEnableTrack() && this._isStarted) {
                let nowtime = Date.now();
                if ((nowtime - this._lastLocationReceiveTime > 60 * 1000) && (nowtime - this._gpsWeakRemindTime > 10 * 60 * 1000)) {
                    this._gpsWeakRemindTime = nowtime;
                    this.popup.toast({
                        message: "GPS信号弱，无法获取当前位置",
                        duration: 2 * 1000
                    });
                }

                if (nowtime - this._lastUpdateTime > 3 * 1000) {
                    this.getAndSaveCurrentPosition();
                }
            }

            this.gpsStateWatch();
        }, 3 * 1000)
    }

    private getAndSaveCurrentPosition() {
        Geolocation.getCurrentPosition(this._options).then(position => {
            this.savePosition(position.coords, position.timestamp);
        }).catch(error => {
            // console.log("send cached location:", this._currentLocation);
            if (this._currentLocation)
                this._currentLocation.DateTime = Date.now();
            !this._currentLocation || this.sendPosition(this._currentLocation, true);
        });
    }

    private createLocationInfo(location) {
        let locationInfo = new LocationInfo();
        locationInfo.Accuracy = location.accuracy; //
        locationInfo.Altitude = location.altitude; //
        locationInfo.Bearing = location.bearing || location.heading;
        locationInfo.DeviceUUID = DeviceInfo.UUID();
        locationInfo.Latitude = location.latitude; //
        locationInfo.LocationProvider = location.locationProvider;
        locationInfo.Longitude = location.longitude; //
        locationInfo.Provider = location.provider;
        locationInfo.Speed = location.speed;

        locationInfo.DataTime = location.time;
        locationInfo.UserId = this.user.Current.UserId;
        locationInfo.Name = this.user.Current.UserName;
        return locationInfo;
    }



    private handlerError(error) {
        console.log('BackgroundGeolocation error', error);
    }

    private needFinish() {
        return this.platofrm.is("ios");
    }
}