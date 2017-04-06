import { PortVisit } from '../data/port-visit';

export const PORTVISITS: PortVisit[] = [
    {
        ShipNameChn: '利克麦雅加达',
        ShipNameEn: 'RICKMERSJAKARTA',
        MMSI: '538001921',
        IMO: '9292010',
        CallSign: 'V7FE9',
        Nation: '马绍尔群岛',
        ShipType: '',
        PrevPort: "大连",
        NextPort: "上海",
        StartTime: new Date("2016-12-15 14:42:00"),
        EndTime: new Date("2016-12-26 11:16:17"),
        Source: null
    },
    {
        ShipNameChn: '尊贵王牌',
        ShipNameEn: 'DIGNITYACE',
        MMSI: '311002900',
        IMO: 'UN9441506',
        CallSign: 'C6WY6',
        Nation: '巴哈马',
        ShipType: '',
        PrevPort: "长滩",
        NextPort: "上海",
        StartTime: new Date("2016-12-15 10:29:00"),
        EndTime: new Date("2016-12-15 05:58:51"),
        Source: 'XG'
    }
]