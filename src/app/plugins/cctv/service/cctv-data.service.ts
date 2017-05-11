import { Injectable } from '@angular/core';

import { ApiClientService } from '../../../base';

@Injectable()
export class CCTVDataService {

    constructor(private _apiClient: ApiClientService) {

    }
    private _dataVersion = 0;
    private _cctvHierarchyUrl = `api/StaticInfo/CCTVHierarchy.default?version=`
    private _cctvPlayParamUrl = `api/MediaAddress/GetUrl/`
    getTree() {
        return this._apiClient.get(this._cctvHierarchyUrl + this._dataVersion).then(data => {
            let items = [];
            data.Items.forEach((item) => {
                let info = JSON.parse(item.Info);
                if (!item.IsDeleted && info.Type === 2)
                    items.push(info);
            });
            let cctvs = items.map(item => {
                return {
                    id: item.Id,
                    name: item.Name,
                    type: item.Type,
                    elementId: item.ElementId,
                    parentId: item.ParentId,
                    providerId: item.ProviderId,
                    forward: item.Forward
                }
            })
            return {
                nodes: cctvs.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                })
            };
        });
    }

    getPlayParam(videoId: string) {
        return this._apiClient.get(this._cctvPlayParamUrl + videoId);
    }
}