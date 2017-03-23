import { Injectable } from '@angular/core';

import {VesselGroup} from '../data/vessel-group';
import {ApiClientService} from '../../../base';
import {Config} from '../../../config';
import {DataSource} from '../../../base';

@Injectable()
export class VesselGroupService {
    DataManager: DataSource<VesselGroup> = new DataSource<VesselGroup>();
    constructor(private _apiClient: ApiClientService) { }
    GetVesselGroups(): Promise<VesselGroup[]> {
        return this._apiClient.get(Config.Plugins.Ship.VesselGroupUrl).then(p => {
            return p.filter(q => q.GroupType !== 1).map(r => {
                return new VesselGroup(r);
            });
        });
    }
    RefreshData() {
        let promise = this.GetVesselGroups();
        promise.then(p => {
            this.DataManager.Reset2(p, q => q.Id.toString());
        });
        return promise;
    }
}

// export class VesselGroupService2 {
//     private _idGroup: { [id: number]: VesselGroup } = {};
//     constructor(private _apiClient: ApiClientService) { }
//     GetVesselGroups(): Promise<VesselGroup[]> {
//         return this._apiClient.get(Config.Plugins.Ship.VesselGroup).then(p => {
//             return p.filter(q => q.GroupType !== 1).map(r => {
//                 return new VesselGroup(r);
//             });
//         });
//     }
//     RefreshData() {
//         let promise = this.GetVesselGroups();
//         promise.then(p => {
//             let idGroup: { [id: number]: VesselGroup } = {};
//             p.forEach(q => {
//                 idGroup[q.Id] = q;
//             });
//             this._idGroup = idGroup;
//         });
//         return promise;
//     }
//     GetVesselGroup(id: number) {
//         if (this._idGroup[id])
//             return this._idGroup[id];
//         else
//             return undefined;
//     }
//     GetSnapshot() {
//         let groups: VesselGroup[] = [];
//         for (var id in this._idGroup) {
//             groups.push(this._idGroup[id]);
//         }
//         return groups;
//     }
// }