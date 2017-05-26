import { Injectable, Inject } from '@angular/core';

import { ApiClientService } from '../../../base';

import { ICCTVConfig, CCTV_Config } from './config';

@Injectable()
export class CCTVDataService {

    constructor(private _apiClient: ApiClientService,
        @Inject(CCTV_Config) private _cctvConfig: ICCTVConfig) {

    }
    private _dataVersion = 0;
    // private _cctvHierarchyUrl = `api/StaticInfo/CCTVHierarchy.default?version=`
    // private _cctvPlayParamUrl = `api/MediaAddress/GetUrl/`

    private _cctvList = [];

    private get webapi() {
        return this._cctvConfig.webapi
    }

    refresh() {
        return this._apiClient.get(this.webapi.hierarchy + this._dataVersion).then(data => {
            let items = [];
            data.Items.forEach((item) => {
                let info = JSON.parse(item.Info);
                if (!item.IsDeleted)
                    items.push(info);
            });
            this._cctvList = items.map(item => {
                return {
                    id: item.Id,
                    name: item.Name,
                    type: item.Type,
                    elementId: item.ElementId,
                    parentId: item.ParentId,
                    providerId: item.ProviderId,
                    forward: item.Forward
                }
            });
        });
    }

    getTree(parentId: string = "") {
        if (parentId === undefined || parentId === null || parentId === "")
            parentId = null;
        return {
            nodes: this._cctvList.filter(item => {
                return item.parentId === parentId;
            }).sort((a, b) => {
                return a.name.localeCompare(b.name);
            })
        };
    }

    getPlayParam(videoId: string) {
        return this._apiClient.get(this.webapi.playParam + videoId);
    }
}