import { DateUtil, ShipUtil } from '../../../base';
export interface IPortVisit {
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    IMO: string;
    CallSign: string
    Nation: string;
    ShipType: string;
    ShipTypeCode: string;
    PrevPort: string;
    NextPort: string;
    StartTime: Date;
    EndTime: Date;
    Source: string;
}

class PortVisit implements IPortVisit {
    constructor(data) {
        Object.assign(this, data);
        this.ShipTypeCode = ShipUtil.GetShipTypeCode(data.ShipType);
        this.EndTime = DateUtil.createDate(data.EndTime);
        this.StartTime = DateUtil.createDate(data.StartTime);
    }
    ShipNameChn: string = null;
    ShipNameEn: string = null;
    MMSI: string = null;
    IMO: string = null;
    CallSign: string = null;
    Nation: string = null;
    ShipType: string = null;
    ShipTypeCode: string;
    PrevPort: string = null;
    NextPort: string = null;
    StartTime: Date = null;
    EndTime: Date = null;
    Source: string = null;
}

export const createPortVisit = (data: any): IPortVisit => {
    return new PortVisit(data);
}