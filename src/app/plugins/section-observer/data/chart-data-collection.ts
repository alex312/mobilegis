class FieldDescription {
    Field: string;
    Label: string;
}
const ShipTypeStatField: FieldDescription[] = [
    { Field: 'Passenger', Label: '客船类' },
    { Field: 'GeneralCargo', Label: '普通货船类' },
    { Field: 'FluidCargo', Label: '液货船类' },
    { Field: 'FluidCargo', Label: '液货船类' },
    { Field: 'Engineering', Label: '工程船类' },
    { Field: 'Assignment', Label: '工作船类' },
    { Field: 'Tugboat', Label: '拖船类' },
    { Field: 'Other', Label: '其它类' }
];
const LOAStatField: FieldDescription[] = [
    { Field: 'LessThan40', Label: '小于40米' },
    { Field: 'Between40And50', Label: '40-50米' },
    { Field: 'Between50And60', Label: '50-60米' },
    { Field: 'Between60And70', Label: '60-70米' },
    { Field: 'GreaterThan70', Label: '大于70米' },
    { Field: 'Unknown', Label: '未知' }
];
const GrossStatField: FieldDescription[] = [
    { Field: 'LessThan300', Label: '小于300吨' },
    { Field: 'Between300And600', Label: '300-600吨' },
    { Field: 'Between600And1000', Label: '600-1000吨' },
    { Field: 'Between1000And2000', Label: '1000-2000吨' },
    { Field: 'GreaterThan2000', Label: '大于2000吨' },
    { Field: 'Unknown', Label: '未知' }
];
const FlagStatField: FieldDescription[] = [
    { Field: 'China', Label: '中国' },
    { Field: 'Foreign', Label: '外籍' },
    { Field: 'Unknown', Label: '未知' }
];
export class ChartDataItem {
    Labels: string[] = [];
    Datas: number[] = [];
    Series: any[][] = [];
}
export class ChartDataCollection {
    ShipType: ChartDataItem;
    LOA: ChartDataItem;
    Gross: ChartDataItem;
    Flag: ChartDataItem;
    constructor(data: any) {
        this.ShipType = new ChartDataItem();
        this.init(this.ShipType, ShipTypeStatField, data.ShipType);
        this.LOA = new ChartDataItem();
        this.init(this.LOA, LOAStatField, data.LOA);
        this.Gross = new ChartDataItem();
        this.init(this.Gross, GrossStatField, data.Gross);
        this.Flag = new ChartDataItem();
        this.init(this.Flag, FlagStatField, data.Flag);
    }
    private init(item: ChartDataItem, stat: FieldDescription[], data: any) {
        stat.forEach(p => {
            item.Labels.push(p.Label);
            item.Datas.push(data[p.Field]);
            item.Series.push([p.Label, data[p.Field]]);
        });
    }
}
export const ShipTypeColors: string[] = [
    '#FF6384',
    '#4BC0C0',
    '#FFCE56',
    '#36A2EB',
    '#AFC084',
    '#2F1284',
    '#E7E9ED'
];