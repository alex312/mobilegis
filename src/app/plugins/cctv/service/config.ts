import { OpaqueToken } from '@angular/core';

export interface ICCTVConfig {
    webapi: IWebApiConfig;
}

interface IWebApiConfig {
    hierarchy: string;
    playParam: string;
}

export let CCTV_Config = new OpaqueToken("cctv.config");

export const dealConfig = (config: ICCTVConfig): ICCTVConfig => {
    return config;
}