import { BerthState } from '../data/berth-state';

export const BERTHSTATES: BerthState[] = [
    {
        ShipNameChn: "天福6",
        ShipNameEn: "TIANFU6",
        MMSI: "413356240",
        IMO: "060109000185",
        CallSign: "BHZX",
        Nation: "中国",
        ShipType: "散货船",
        BerthName: "G5",
        BerthTime: new Date("2017-03-22 11:05:10"),
        EndTime: null,
    },
    {
        ShipNameChn: "弘泰27",
        ShipNameEn: "HONGTAI27",
        MMSI: null,
        IMO: null,
        CallSign: "BVJV8",
        Nation: "中国",
        ShipType: "集装箱船",
        BerthName: "北5",
        BerthTime: new Date("2017-03-22 11:11:13"),
        EndTime: null,
    },
]