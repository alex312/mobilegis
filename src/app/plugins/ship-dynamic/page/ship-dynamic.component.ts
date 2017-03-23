import { Component } from '@angular/core';
import { DynamicDataService } from '../service/dynamic-data.service';

@Component({
    selector: 'ship-dynamic-page',
    templateUrl: './ship-dynamic.component.html'
})
export class ShipDynamicPage {
    dynamicType: string = "yqb";

    _portVisitList;
    _vesselDynamicList;
    _rawBoatDynamicList;
    _berthStateList;
    _anchorStateList;
    constructor(private _dataService: DynamicDataService) {
        _dataService.getPortVisit().then(portVisits => {
            this._portVisitList = portVisits;
        })

        _dataService.getVesselDynamic().then(vesselDynamics => {
            this._vesselDynamicList = vesselDynamics;
        })

        _dataService.getRawBoatDynamic().then(rawBoatDynamics => {
            this._rawBoatDynamicList = rawBoatDynamics;
        })

        _dataService.getBerthState().then(berthStates => {
            this._berthStateList = berthStates;
        })

        _dataService.getAnchorState().then(anchorStates => {
            this._anchorStateList = anchorStates;
        })
    }
}