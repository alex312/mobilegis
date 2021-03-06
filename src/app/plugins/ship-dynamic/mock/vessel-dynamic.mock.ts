import { VesselDynamic } from '../data/vessel-dynamic';
export const VESSELDYNAMICS: VesselDynamic[] = [
    {
        PlanInfoId: 88342,
        ShipNameChn: "高铂",
        ShipNameEn: "GOLBON",
        MMSI: "422026900",
        IMO: "UN9283033",
        CallSign: "EPBL9",
        Nation: "伊朗",
        ShipType: "集装箱船",
        ShipTypeCode: "205",
        ShipLength: 221.62,
        ShipWidth: 29.8,
        Draught: 9.6,
        Source: "XG",
        StartLocation: "北9",
        StartLocationAlias: "N9",
        ActionType: "离",
        EndLocation: "离港",
        EndLocationAlias: null,
        PlanTime: new Date("2016-12-08 20:00:00"),
        StartTime: new Date("2016-12-08 20:57:29"),
        EndTime: new Date("2016-12-08 22:26:38"),
        Pilot: [{ Id: 27305, NavPlanId: 88342, FId: 81 }],
    },
    {
        PlanInfoId: 88343,
        ShipNameChn: "鸿桥",
        ShipNameEn: "HONGQIAO",
        MMSI: "312830000",
        IMO: "UN9390800",
        CallSign: "V3LS2",
        Nation: "伯利兹",
        ShipType: "干货船",
        ShipTypeCode: "201",
        ShipLength: 81,
        ShipWidth: 13.6,
        Draught: 4.9,
        Source: "XG",
        StartLocation: "三突堤西",
        StartLocationAlias: null,
        ActionType: "离",
        EndLocation: "离港",
        EndLocationAlias: null,
        PlanTime: new Date("2016-12-08 20:00:00"),
        StartTime: new Date("2016-12-08 21:04:37"),
        EndTime: new Date("2016-12-08 22:13:47"),
        Pilot: [{ Id: 27305, NavPlanId: 88342, FId: 81 }],
    }
]