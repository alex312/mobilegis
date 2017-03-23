import { Injectable } from '@angular/core'

import { ApiClientService } from '../../../base';

import { PORTVISITS } from '../mock/port-visit.mock';
import { VESSELDYNAMICS } from '../mock/vessel-dynamic.mock';
import { RAWBOATDYNAMICS } from '../mock/raw-boat-dynamic.mock';
import { BERTHSTATES } from '../mock/berth-state.mock';
import { ANCHORSTATES } from '../mock/anchor-state.mock';

@Injectable()
export class DynamicDataService {
    constructor(private _apiClient: ApiClientService) {

    }

    private _portVisitUrl: string = "http://192.168.13.35:9007/api/PortVisit?shipKeyword=&shipTypeCode=&start=2016-12-02&end=2016-12-09&startIndex=0&count=20";
    getPortVisit() {
        // return Promise.resolve(PORTVISITS);
        return this._apiClient.get(this._portVisitUrl).then(result => {
            return result.data;
        });
    }

    private _vesselDynamicUrl: string = "http://192.168.13.35:9007/api/VesselDynamic?shipKeyword=&shipTypeCode=&start=2016-12-02&end=2016-12-09&startIndex=0&count=20&source=";
    getVesselDynamic() {
        return this._apiClient.get(this._vesselDynamicUrl).then(result => {
            return result.data;
        });
    }
    private _rawBoatDyanmicUrl: string = "http://192.168.13.35:9007/api/RawBoatDynamic4Approval?shipKeyword=&companyId=&start=2016-12-02&end=2016-12-09&startIndex=0&count=20";
    getRawBoatDynamic() {
        return this._apiClient.get(this._rawBoatDyanmicUrl).then(result => {
            return result.data;
        });
    }

    private _berthStateUrl: string = "http://192.168.13.35:9007/api/BerthState?shipKeyword=&startIndex=0&count=20";
    getBerthState() {
        return this._apiClient.get(this._berthStateUrl).then(result => {
            return result.data;
        });
    }

    private _anchorStateUrl: string = "http://192.168.13.35:9007/api/AnchorState?shipKeyword=&startIndex=0&count=20";
    getAnchorState() {
        return this._apiClient.get(this._anchorStateUrl).then(result => {
            return result.data;
        });
    }
}