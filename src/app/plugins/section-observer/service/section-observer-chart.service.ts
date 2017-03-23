import { Injectable } from '@angular/core';

import {ApiClientService} from '../../../base';
import {ChartDataCollection} from '../data/chart-data-collection';
import {Config} from '../../../config';

@Injectable()
export class SectionServerChartService {
    constructor(private _apiClient: ApiClientService) { }
    Stat(regionId, start, end): Promise<ChartDataCollection> {
        return this._apiClient.get(`${Config.Plugins.SectionObserver.RecordUrl}/FastStat?regionId=${regionId}&start=${start}&end=${end}`).then(p => {
            return new ChartDataCollection(p);
        });
    }
}