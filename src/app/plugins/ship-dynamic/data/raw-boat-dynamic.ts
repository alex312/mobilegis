import { DateUtil } from '../../../base';
export interface IRawBoatDynamic {
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    CallSign: string;
    ShipType: string;
    ShipTypeCode: string;
    CompanyName: string;
    ShipLength: number;
    ShipWidth: number;
    Draught: number;
    Source: string;
    ActionTypeName: string;
    StartLocation: string;
    EndLocation: string;
    PlanTime: Date;
    StartTime: Date;
    EndTime: Date;
    VesselName: string;
}

class RawBoatDynamic implements IRawBoatDynamic {
    constructor(data: any) {
        Object.assign(this, data);
        this.PlanTime = DateUtil.createDate(data.PlanTime);
        this.StartTime = DateUtil.createDate(data.StartTime);
        this.EndTime = DateUtil.createDate(data.EndTime);
    }

    ShipNameChn: string = null;
    ShipNameEn: string = null;
    MMSI: string = null;
    CallSign: string = null;
    ShipType: string = null;
    ShipTypeCode: string = null;
    CompanyName: string = null;
    ShipLength: number = null;
    ShipWidth: number = null;
    Draught: number = null;
    Source: string = null;
    ActionTypeName: string = null;
    StartLocation: string = null;
    EndLocation: string = null;
    PlanTime: Date = null;
    StartTime: Date = null;
    EndTime: Date = null;
    VesselName: string = null;
}

export const createRawBoatDynamic = (data: any): IRawBoatDynamic => {
    return new RawBoatDynamic(data);
}