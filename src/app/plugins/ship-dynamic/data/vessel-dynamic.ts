import { DateUtil } from '../../../base';
export interface IVesselDynamic {
    PlanInfoId: number;
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    IMO: string;
    CallSign: string;
    Nation: string;
    ShipType: string;
    ShipTypeCode: string;
    ShipLength: number;
    ShipWidth: number;
    Draught: number;
    Source: string;
    StartLocation: string;
    StartLocationAlias: string;
    ActionType: string;
    EndLocation: string;
    EndLocationAlias: string;
    PlanTime: Date;
    StartTime: Date;
    EndTime: Date;
    Pilot: IPilot[];
}

class VesselDynamic implements IVesselDynamic {
    constructor(data) {
        Object.assign(this, data);
        this.PlanTime = DateUtil.createDate(data.PlanTime);
        this.StartTime = DateUtil.createDate(data.StartTime);
        this.EndTime = DateUtil.createDate(data.EndTime);
    }
    PlanInfoId: number;
    ShipNameChn: string;
    ShipNameEn: string;
    MMSI: string;
    IMO: string;
    CallSign: string;
    Nation: string;
    ShipType: string;
    ShipTypeCode: string;
    ShipLength: number;
    ShipWidth: number;
    Draught: number;
    Source: string;
    StartLocation: string;
    StartLocationAlias: string;
    ActionType: string;
    EndLocation: string;
    EndLocationAlias: string;
    PlanTime: Date;
    StartTime: Date;
    EndTime: Date;
    Pilot: IPilot[];
}

export const createVesselDynamic = (data: any): IVesselDynamic => {
    return new VesselDynamic(data);
}

export interface IPilot {
    Id: number;
    NavPlanId: number;
    FId: number;
}
