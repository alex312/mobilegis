export class ShipArchive {
    constructor() {
    }

    ID: number;
    IMONO: string; //IMO
    MMSI: string; //MMSI
    ShipNO: string; //船舶编号
    InitialRegistrationNO: string; //初次登记号
    ShipSurveyNO: string;   //船检登记号
    Cardbook: string;   //牌簿号
    ICNO: string;   //IC卡号
    Callsign: string;   //呼号
    LocalName: string;  //本地船名
    ShipNameEn: string; //英文船名
    FormerName1: string;    //曾用名1
    FormerName2: string;    //曾用名2
    FormerName3: string;    //曾用名3
    StatusCode: string;     //船舶状态
    ShipTypeCode: string;   //船舶类型
    FlagCode: string;   //  国籍
    RegistrationPort: string; //船籍港
    InlandShipMark: string; //船舶性质
    BuildDate: string;  //建成日期
    Shipyard: string;   //造船厂
    Owner: string;  //船舶所有人
    ContactNO: string;  //联系人电话
    Operator: string;   //船舶经营人
    ClassificationCode: string; //船级社
    MaxSpeed: number;   //最大航速
    LOA: number;    //船舶长度
    LBP: number;    //垂直间长
    Depth: number;  //船舶型深
    BM: number; //船舶型宽
    Draught: number;    //夏季满载吃水
    Height: number; //船舶高度
    Gross: number;  //总吨
    Net: number;    //净吨
    DWT: number;    //载重吨
    Holds: string;  //各货舱容积
    Hatch: string;  //货舱数及总容积
    MinFreeboard: string;   //最小干舷
    WindLoading: number;    //核定抗风等级
    Slot: number;   //箱位
    Carport: number;    //车位
    PassengerSpaces: number;    //客位
    MinSafeManningNO: number;   //最低安全配员数
    MaxSurvivalEquipmentNO: number; //救生设备最大数
    HullMaterialCode: string;   //船体材料
    PropellerType: string;  //推进器种类
    Power: number;  //主机功率
    RPM: number;    //主机转速
    BuildPlace: string;//主机制造厂
    PowerType: string;  //主机型式
    PowerNO: number;    //主机数量
    PowerBoreNO: string;    //  主机缸数
    CylinderBore: string;   //主机缸径
    PowerItinerary: number; //主机行程
    Decks: number;  //甲板层数
    Ballast: string;
    AuxiliaryPower: string;
    PowerClass: string;
    DataSource: number;
    LastUpdateTime: number;
}