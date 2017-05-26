import { OpaqueToken } from '@angular/core';

export interface ILocationConfig {
    background_geo_config: IBackgroundGEOConfig;
    geo_option: IGeoOption;
    webapi: IWebApiConfig;
}

interface IWebApiConfig {
    storage: string;
}

interface IGeoOption {
    timeout: number;
    enableHighAccuracy: boolean;
}

interface IBackgroundGEOConfig {
    debug: boolean;
    desiredAccuracy: number;
    stationaryRadius: number;
    distanceFilter: number;
    maxLocations: number;
    stopOnTerminate: boolean;
    locationProvider: number;
    interval: number;
    notificationTitle: string;
    notificationText: string;
    activityType: string;
}

export let Location_Config = new OpaqueToken("location.config");

export const dealConfig = (config: ILocationConfig): ILocationConfig => {
    return config;
}