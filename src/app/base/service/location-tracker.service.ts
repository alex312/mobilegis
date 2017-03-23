import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BackgroundGeolocation } from 'ionic-native';

import { DeviceInfo } from '../util/device-info';
import { ApiClientService } from './api-client.service';

import { LocationInfo } from './location-info';
import { MessagePupopService } from './message-pupop.service';

@Injectable()
export class LocationTrackerService {

    locationStorageUrl: string = "http://192.168.13.35/GPSLocation/api/Location";//TODO:修改url
    isStarted = false;
    config = {
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

    constructor(private platofrm: Platform, private apiClient: ApiClientService, private popup: MessagePupopService) {
        // this.setLocationTrackerEnable();
    }

    startTrack() {
        if (!this.isStarted) {
            this.isStarted = true;
            console.log("startTrack Location");
            BackgroundGeolocation.configure(this.savePosition.bind(this), this.handlerError, this.config);
            BackgroundGeolocation.start();
            console.log("end startTrack Location");
        }
    }

    stopTrack() {
        this.isStarted = false;
        if (this.needFinish()) {
            BackgroundGeolocation.finish();
        }
        BackgroundGeolocation.stop();
    }

    setLocationTrackerEnable() {
        BackgroundGeolocation.isLocationEnabled()
            .then((enabled) => {
                if (!enabled) {
                    this.popup.confirm({
                        title: "提示",
                        message: "GPS未开启，是否马上设置？",
                        agreeText: "设置",
                        agreeHandler: () => BackgroundGeolocation.showLocationSettings(),
                        disagreeHandler: () => {
                            this.popup.toast({
                                message: '只有在开启GPS后才能正常记录轨迹,请开启GPS',
                                duration: 2000
                            })
                        }
                    })

                }
            })
            .catch(this.handlerError.bind(this));
    }

    private savePosition(location) {
        let date = new Date();
        console.log(" [js] BackgroundGeolocation callback:" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds);
        console.log(location);

        let locationInfo = this.createLocationInfo(location);

        this.apiClient.post(this.locationStorageUrl, locationInfo);

        if (this.needFinish())
            BackgroundGeolocation.finish(); // FOR IOS ONLY
    }

    private createLocationInfo(location) {
        let locationInfo = new LocationInfo();
        locationInfo.Accuracy = location.accuracy;
        locationInfo.Altitude = location.altitude;
        locationInfo.Bearing = location.bearing;
        locationInfo.DeviceUUID = DeviceInfo.UUID();
        locationInfo.Latitude = location.latitude;
        locationInfo.LocationProvider = location.locationProvider;
        locationInfo.Longitude = location.longitude;
        locationInfo.Provider = location.provider;
        locationInfo.Speed = location.speed;

        locationInfo.DataTime = location.time;
        // locationInfo.UserId = this.user.Current.UserId;
        // locationInfo.Name = this.user.Current.UserName;
        return locationInfo;
    }

    private handlerError(error) {
        console.log('BackgroundGeolocation error：' + error);
    }

    private needFinish() {
        return this.platofrm.is("ios");
    }
}