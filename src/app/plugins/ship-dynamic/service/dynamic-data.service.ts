import { Injectable } from '@angular/core'

import { ApiClientService } from '../../../base';
import { IQueryParam, IUrlFactory } from './url-factory';

export interface IDataService {
    getData: (param: IQueryParam, urlFactory: IUrlFactory) => Promise<any>;
    getLocation: (arg: string) => Promise<any>;
}


@Injectable()
export class DynamicDataService implements IDataService {
    constructor(private _apiClient: ApiClientService) {

    }
    // getData(url: string) {
    //     return this._apiClient.get(url);
    // }

    getShipType() {
        return this._apiClient.get("api/shipTypeMetadata?categoryId=0302");
    }

    getSource() {
        return this._apiClient.get("api/DataSource?categoryId=小船公司");
    }

    getData(param: IQueryParam, urlFactory: IUrlFactory) {
        return this._apiClient.get(urlFactory.createUrl(param));
    }

    private locationUrl = "api/vesselLocationInfo";
    getLocation(shipNameCh) {
        return this._apiClient.get(this.locationUrl + "?shipNameCN=" + shipNameCh);
    }
}

