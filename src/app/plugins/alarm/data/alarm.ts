export class Alarm {
    Id: number;
    RuleAlias: string;
    OperationType: number;
    StatusId: string;
    RuleId: string;
    RegionId: string;
    Geometry: string;
    TrackId: string;
    EventTime: Date;
    EndTime: Date;
    Place: string;
    RuleType: number;
    Sog: number;
    Cog: number;
    Heading: number;
    Description: string;
    ProcessState: string;
    VesselId: string;
    MMSI: string;
    LocalName: string;
    ShipNameEn: string;
    VesselName: string;
    Origins: string;
    RegionName: string;
    EventTimeDisplay: string;
    // TODO：以下是舟山需求
    CableId: string;
    Distance: number;
    Desc: string;
    Voltage: string;
    DistanceRound: number;
}