import { Injectable } from '@angular/core';

import {NearbyShip} from '../data/nearby-ship';
import {ApiClientService, Format} from '../../../base';
import {Config} from '../../../config';

@Injectable()
export class NearbyShipService {
    private _interval: number = 0.1;
    constructor(private _apiClient: ApiClientService) { }
    GetShips(lon, lat): Promise<NearbyShip[]> {
        var date = new Date(Date.now() - 3 * 60 * 60 * 1000);
        return this._apiClient.get(`${Config.Plugins.Ship.SnapshotUrl}/GetSnapshotByRegion/(${lon - this._interval},${lon + this._interval},${lat - this._interval},${lat + this._interval})/${Format.FormatDate(date)}`).then(p => {
            return p.map(q => {
                return new NearbyShip(q);
            });
        });
    }
}