import { Injectable } from '@angular/core'

import { ApiClientService } from '../../../base';

// import { PORTVISITS } from '../mock/port-visit.mock';
// import { VESSELDYNAMICS } from '../mock/vessel-dynamic.mock';
// import { RAWBOATDYNAMICS } from '../mock/raw-boat-dynamic.mock';
// import { BERTHSTATES } from '../mock/berth-state.mock';
// import { ANCHORSTATES } from '../mock/anchor-state.mock';



@Injectable()
export class DynamicDataService {
    constructor(private _apiClient: ApiClientService) {

    }
    getData(url: string) {
        return this._apiClient.get(url);
    }

}

export class DynamicDataUrlCreater {

    private _portVisitUrl: string = "api/PortVisit";
    portVisitUrl(param: IQueryParam) {
        return `${this._portVisitUrl}?shipKeyword=${param.shipKeyword}&shipTypeCode=${param.shipTypeCode}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}`;
    }

    private _vesselDynamicUrl: string = "api/VesselDynamic";
    vessDynamicUrl(param: IQueryParam) {
        return `${this._vesselDynamicUrl}?shipKeyword=${param.shipKeyword}&shipTypeCode=${param.shipTypeCode}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}&source=${param.source}`;
    }

    private _rawBoatDyanmicUrl: string = "api/RawBoatDynamic4Approval";
    rawBoatDynamicUrl(param: IQueryParam) {
        return `${this._rawBoatDyanmicUrl}?shipKeyword=${param.shipKeyword}&companyId=${param.companyId}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}`;
    }

    private _berthStateUrl: string = "api/BerthState";
    berthStateUrl(param: IQueryParam) {
        return `${this._berthStateUrl}?shipKeyword=${param.shipKeyword}&startIndex=${param.startIndex}&count=${param.count}`;
    }

    private _anchorStateUrl: string = "api/AnchorState";
    anchorStateUrl(param: IQueryParam) {
        return `${this._anchorStateUrl}?shipKeyword=${param.shipKeyword}&startIndex=${param.startIndex}&count=${param.count}`;
    }
}

export class IQueryParam {
    shipKeyword: string;
    startIndex: number;
    count: number;

    shipTypeCode: string;
    start: string;
    end: string;

    source: string;

    companyId: string;
}