import { DateUtil, ShipUtil } from '../../../base';

export interface IAnchorState {
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    IMO: string;
    CallSign: string;
    Nation: string;
    ShipType: string;
    ShipTypeCode: string;
    AnchorageName: string;
    AnchorTime: Date;
    EndTime: Date;
}

class AnchorState implements IAnchorState {
    constructor(data: any) {
        Object.assign(this, data);
        this.ShipTypeCode = ShipUtil.GetShipTypeCode(data.ShipType);
        this.AnchorTime = DateUtil.createDate(data.AnchorTime);
        this.EndTime = DateUtil.createDate(data.EndTime);
    }

    ShipNameChn: string = null;
    ShipNameEn: string = null;
    MMSI: string = null;
    IMO: string = null;
    CallSign: string = null;
    Nation: string = null;
    ShipType: string = null;
    ShipTypeCode: string;
    AnchorageName: string = null;
    AnchorTime: Date = null;
    EndTime: Date = null;
}

export const createAnchorState = (data: any): IAnchorState => {
    return new AnchorState(data);
}