import { Injectable } from '@angular/core';

import { Cable } from '../data/cable';
import { ApiClientService } from '../../../base';
import { IAlarmConfig, Alarm_Config } from './config';
// import { Config } from '../../../config';

@Injectable()
export class CableService {
    constructor(private _apiClient: ApiClientService, private _cableUrl: string) {
    }
    private _idCable: { [id: string]: Cable } = {};
    private getCables() {
        return this._apiClient.get(this._cableUrl);
    }
    Init() {
        let promise = this.getCables();
        promise.then(p => {
            let dic: { [Id: string]: Cable } = {};
            p.forEach(q => {
                dic[q.Id] = q;
            });
            this._idCable = dic;
        });
        return promise;
    }
    GetCable(id: string) {
        if (this._idCable)
            return this._idCable[id];
        else
            return undefined;
    }
}

const cableServiceFactory = (_apiClient: ApiClientService, config: IAlarmConfig): CableService => {
    return new CableService(_apiClient, config.webapi.cable);
}

export const cableServiceProvider = {
    provide: CableService,
    useFactory: cableServiceFactory,
    deps: [ApiClientService, Alarm_Config]
}