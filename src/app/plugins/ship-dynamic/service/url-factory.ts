import { isPresent } from '../../../base';

import { IConstructor } from '../data/common-data';


/**
 * abstract 
 */
class QueryParam implements IQueryParam {
    constructor() {

    }
    private _shipKeyword: string;
    get shipKeyword() {
        return this._shipKeyword || "";
    }
    set shipKeyword(value: string) {
        this._shipKeyword = value;
    }

    private _startIndex: number;
    get startIndex() {
        if (isPresent(this._startIndex))
            return this._startIndex;
        return 0;
    }
    set startIndex(value: number) {
        this._startIndex = value;
    }

    private _count: number;
    get count(): number {
        return isPresent(this._count) ? this._count : 30;
    }
    set count(value: number) {
        this._count = value;
    }

    private _shipTypeCode: string;
    get shipTypeCode(): string {
        return this._shipTypeCode || "";
    }
    set shipTypeCode(value: string) {
        this._shipTypeCode = value;
    }

    private _start: string;
    get start(): string {
        return this._start || "";
    }
    set start(value: string) {
        this._start = value;
    }
    private _end: string;
    get end(): string {
        return this._end || "";
    }
    set end(value: string) {
        this._end = value;
    }

    private _source: string;
    get source(): string {
        return this._source || "";
    }
    set source(value: string) {
        this._source = value;
    }

    private _companyId: string;
    get companyId(): string {
        return this._companyId || ""
    }
    set companyId(value: string) {
        this._companyId = value;
    }
}

abstract class UrlFactory implements IUrlFactory {
    abstract readonly baseUrl: string;
    createUrl = (param: IQueryParam) => {
        let url = this.baseUrl;
        if (isPresent(param))
            url = this.baseUrl + "?" + this.formatParam(param);
        return url;
    };
    protected abstract formatParam: (param: IQueryParam) => string;
    // abstract createParam: () => IQueryParam;
}
/**
 * PortVisit 
 */
class PortVisitUrlFactory extends UrlFactory {
    readonly baseUrl = "api/PortVisit";
    protected formatParam = (param: IQueryParam): string => {
        return `shipKeyword=${param.shipKeyword}&shipTypeCode=${param.shipTypeCode}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}`;
    }
}
/**
 * VesselDynamic 
 */
class VesselDynamicUrlFactory extends UrlFactory {
    readonly baseUrl = "api/VesselDynamic";
    protected formatParam = (param: IQueryParam): string => {
        return `shipKeyword=${param.shipKeyword}&shipTypeCode=${param.shipTypeCode}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}&source=${param.source}`;
    }
}
/**
 * RawBoatDyanmic 
 */
class RawBoatDyanmicUrlFactory extends UrlFactory {
    readonly baseUrl = "api/RawBoatDynamic4Approval";
    protected formatParam = (param: IQueryParam): string => {
        return `shipKeyword=${param.shipKeyword}&companyId=${param.companyId}&start=${param.start}&end=${param.end}&startIndex=${param.startIndex}&count=${param.count}`;
    }
}
/**
 * BerthState 
 */
class BerthStateUrlFactory extends UrlFactory {
    readonly baseUrl = "api/BerthState";
    protected formatParam = (param: IQueryParam): string => {
        return `shipKeyword=${param.shipKeyword}&startIndex=${param.startIndex}&count=${param.count}`;
    };
}
/**
 * AnchorState 
 */
class AnchorStateUrlFactory extends UrlFactory {
    readonly baseUrl = "api/AnchorState";
    protected formatParam = (param: IQueryParam): string => {
        return `shipKeyword=${param.shipKeyword}&startIndex=${param.startIndex}&count=${param.count}`;
    };
}


const createUrlFactory = <T extends IUrlFactory, TQueryParam extends IQueryParam>(factory: IConstructor): IUrlFactory => {
    return new factory<IUrlFactory>();
}

export interface IQueryParam {
    shipKeyword: string;
    startIndex: number;
    count: number;
    shipTypeCode: string;
    start: string;
    end: string;
    source: string;
    companyId: string;
}


export interface IUrlFactory {
    createUrl: (IQueryParam) => string;
}

export const createQueryParam = (): IQueryParam => {
    return new QueryParam();
}

export const UrlFactorys = {
    PortVisit: createUrlFactory(PortVisitUrlFactory),
    VesselDynamic: createUrlFactory(VesselDynamicUrlFactory),
    RawBoatDyanmic: createUrlFactory(RawBoatDyanmicUrlFactory),
    Berth: createUrlFactory(BerthStateUrlFactory),
    Anchor: createUrlFactory(AnchorStateUrlFactory)
}
