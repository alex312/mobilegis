import { Component, OnInit } from '@angular/core';

import { isBlank, isBlankString } from '../../../../base';

import { DetailComponent } from '../detail.component';
import { DynamicDataService } from '../../service/dynamic-data.service';

@Component({
    selector: 'vessel-dynamic-detail',
    templateUrl: './vessel-dynamic-detail.component.html'
})
export class VesselDynamicDetailComponent extends DetailComponent implements OnInit {
    constructor(private _dataService: DynamicDataService) {
        super();

    }

    ngOnInit() {
        this._dataService.getLocation(this.viewModule.data.ShipNameChn).then(result => {
            if (isBlankString(result.LocationWithVTSArea + result.LocationWithArea + result.LocationWithPoint))
                this._currentLocation = "不再辖区附近，无法定位";
            else
                this._currentLocation = result.LocationWithVTSArea + "," + result.LocationWithArea;
        });
    }

    private _currentLocation: string;
    get currentLocation() {
        return this._currentLocation;
    }
    set currentLocation(value: string) {
        this._currentLocation = value;
    }
}