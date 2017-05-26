import { DateUtil, ShipUtil } from '../../../base';
export interface IBerthState {
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    IMO: string;
    CallSign: string;
    Nation: string;
    ShipType: string;
    ShipTypeCode: string;
    BerthName: string;
    BerthTime: Date;
    EndTime: Date;
}

class BerthState implements IBerthState {
    constructor(data) {
        Object.assign(this, data);
        this.ShipTypeCode = ShipUtil.GetShipTypeCode(data.ShipType);
        this.BerthTime = DateUtil.createDate(data.BerthTime);
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
    BerthName: string = null;
    BerthTime: Date = null;
    EndTime: Date = null;
}

export const createBerthState = (data: any): IBerthState => {
    return new BerthState(data);
}