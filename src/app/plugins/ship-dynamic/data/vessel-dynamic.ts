export class VesselDynamic {
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
    Pilot: Pilot[];
}

export class Pilot {
    Id: number;
    NavPlanId: number;
    FId: number;
}
// {"Id":27305,"NavPlanId":88342,"FId":81}]