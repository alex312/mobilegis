import { Injectable } from '@angular/core';

import {ApiClientService } from '../../../base';
import {SectionObserver} from '../data/section-observer';
import {Config} from '../../../config';

@Injectable()
export class SectionObserverService {
    constructor(private _apiClient: ApiClientService) { }
    GetSectionObservers(): Promise<SectionObserver[]> {
        return this._apiClient.get(Config.Plugins.SectionObserver.SectionObserverUrl).then(p => {
            return p.map(q => {
                return new SectionObserver(q);
            });
        });
    }
}