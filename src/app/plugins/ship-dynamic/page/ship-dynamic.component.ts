import { Component } from '@angular/core';
import { DynamicDataService, DynamicDataUrlCreater, IQueryParam } from '../service/dynamic-data.service';

@Component({
    selector: 'ship-dynamic-page',
    templateUrl: './ship-dynamic.component.html'
})
export class ShipDynamicPage {
    dynamicType: string = "yqb";

    private _urlCreater: DynamicDataUrlCreater;
    private _queryParam: IQueryParam;

    _portVisitModel = new DynamicPageModel();
    _vesselDynamicModel = new DynamicPageModel();
    _rawBoatDynamicModel = new DynamicPageModel();
    _berthStateModel = new DynamicPageModel();
    _anchorStateModel = new DynamicPageModel();

    private _typeQueryDict = {
        "yqb": (needReset: boolean) => {
            if (needReset)
                this._portVisitModel.resetQueryParam();
            this._dataService.getData(this._urlCreater.portVisitUrl(this._portVisitModel.queryParam))
                .then(result => {
                    this._portVisitModel.itemSource = result.data;
                    this._portVisitModel.totalCount = result.total;
                    this._portVisitModel.queryParam.startIndex += result.data.length;
                })
        },
        "sycb": (needReset: boolean) => {
            if (needReset)
                this._vesselDynamicModel.resetQueryParam();
            this._dataService.getData(this._urlCreater.vessDynamicUrl(this._vesselDynamicModel.queryParam))
                .then(result => {
                    this._vesselDynamicModel.itemSource = result.data;
                    this._vesselDynamicModel.totalCount = result.total;
                    this._vesselDynamicModel.queryParam.startIndex += result.data.length;
                })
        },
        "xc": (needReset: boolean) => {
            if (needReset)
                this._rawBoatDynamicModel.resetQueryParam();
            this._dataService.getData(this._urlCreater.rawBoatDynamicUrl(this._rawBoatDynamicModel.queryParam))
                .then(result => {
                    this._rawBoatDynamicModel.itemSource = result.data;
                    this._rawBoatDynamicModel.totalCount = result.total;
                    this._rawBoatDynamicModel.queryParam.startIndex += result.data.length;
                })
        },
        "kb": (needReset: boolean) => {
            if (needReset)
                this._berthStateModel.resetQueryParam();
            this._dataService.getData(this._urlCreater.berthStateUrl(this._berthStateModel.queryParam))
                .then(result => {
                    this._berthStateModel.itemSource = result.data;
                    this._berthStateModel.totalCount = result.total;
                    this._berthStateModel.queryParam.startIndex += result.data.length;
                })
        },
        "mb": (needReset: boolean) => {
            if (needReset)
                this._anchorStateModel.resetQueryParam();
            this._dataService.getData(this._urlCreater.anchorStateUrl(this._anchorStateModel.queryParam))
                .then(result => {
                    this._anchorStateModel.itemSource = result.data;
                    this._anchorStateModel.totalCount = result.total;
                    this._anchorStateModel.queryParam.startIndex += result.data.length;
                })
        }
    }

    constructor(private _dataService: DynamicDataService) {
        this._urlCreater = new DynamicDataUrlCreater();
        this._portVisitModel = new DynamicPageModel();
        this._vesselDynamicModel = new DynamicPageModel();
        this._rawBoatDynamicModel = new DynamicPageModel();
        this._berthStateModel = new DynamicPageModel();
        this._anchorStateModel = new DynamicPageModel();
        this._typeQueryDict[this.dynamicType](true);
    }

    dynamicTypeChanged(event) {
        // this._typeQueryDict[this.dynamicType]();
    }

    doRefresh(event) {
        this._typeQueryDict[this.dynamicType](true);
    }

    doInfinite(event) {
        this._typeQueryDict[this.dynamicType]();
    }

}

class DynamicPageModel {
    itemSource;
    queryParam: IQueryParam;
    totalCount;

    constructor() {
        this.resetQueryParam();
    }

    resetQueryParam() {
        this.queryParam = {
            shipKeyword: "",
            startIndex: 0,
            count: 50,
            shipTypeCode: "",
            start: null,
            end: null,
            source: "",
            companyId: ""
        }
    }
}