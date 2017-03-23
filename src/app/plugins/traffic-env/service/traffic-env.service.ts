import { Injectable } from '@angular/core';

import {ApiClientService} from '../../../base';
import {TrafficEnvSummary} from '../data/traffic-env-summary';
import {Config} from '../../../config';

@Injectable()
export class TrafficEnvService {
    private _idTrafficEnv: { [Id: number]: TrafficEnvSummary } = {};
    constructor(private _apiClient: ApiClientService) { }
    Init() {
        let promise = this._apiClient.get(Config.Plugins.TrafficEnv.LocationUrl);
        promise.then(p => {
            let dic: { [Id: number]: TrafficEnvSummary } = {};
            p.forEach(q => {
                dic[q.Id] = q;
            });
            this._idTrafficEnv = dic;
        });
        return promise;
    }
    GetTrafficEnv(id) {
        if (this._idTrafficEnv)
            return this._idTrafficEnv[id];
        else
            return undefined;
    }
}