export class ShipUtil {
    static GetShipTypeColor(code: string) {
        if (code === undefined || code === null || code.length < 2 || code.length > 3)
            return shipTypColor.Infinity;
        if (code === "55")
            return Object.keys(shipTypColor)[code];

        let codeStart = code[0];
        let key = null;

        key = Object.keys(shipTypColor).find(key => { return key.length === code.length && key.startsWith(codeStart) });
        if (key === undefined || key === null)
            return shipTypColor.Infinity;
        return shipTypColor[key];
    }

    static GetShipTypeCode(name: string) {
        return Object.keys(ShipTypes)
            .find(key => ShipTypes[key] === name);
    }

    static GetShipTypeName(code: string) {

        if (code === undefined || code === null || code.length < 2 || code.length > 3)
            return "其他";

        let type = null;
        if (code.length == 2)
            type = ShipTypes[code[0] + "0"];
        else
            type = ShipTypes[code];

        if (type === undefined || type === null)
            return "其他"
        return type;
    }
}

const shipTypColor = {
    "60": "#FFCC00",
    "70": "#00CC00",
    "80": "#FF3399",
    "30": "#666666",
    "55": "#0066CC",
    "50": "#CC9933",
    "100": "#FFCC00",
    "200": "#008200",
    "300": "#FF0164",
    "400": "#666666",
    "500": "#0066CC",
    "600": "#CC9933",
    "Infinity": "#999999",
}
const ShipTypes = {
    "60": "客船", "70": "货船", "80": "危险品船", "30": "渔船", "55": "公务船", "50": "作业船",
    "100": "客船类",
    "101": "普通客船",
    "102": "客货船",
    "103": "客渡船",
    "104": "车客渡船",
    "105": "旅游客船",
    "106": "高速客船",
    "107": "客驳船",
    "108": "滚装客船",
    "109": "客箱船",
    "110": "火车渡船（客）",
    "111": "地效翼船",
    "112": "高速客滚船",
    "200": "普通货船类",
    "201": "干货船",
    "202": "杂货船",
    "203": "散货船",
    "204": "散装水泥运输船",
    "205": "集装箱船",
    "206": "滚装船",
    "207": "多用途船",
    "208": "木材船",
    "209": "水产品运输船",
    "210": "重大件运输船",
    "211": "驳船",
    "212": "汽车渡船",
    "213": "挂桨机船",
    "214": "冷藏船",
    "215": "火车渡船",
    "216": "矿/散/油船",
    "217": "半潜船",
    "300": "液货船类",
    "301": "油船",
    "302": "散装化学品船",
    "303": "散装化学品船/油船",
    "304": "液化气船",
    "305": "散装沥青船",
    "306": "油驳",
    "307": "一般液货船",
    "400": "工程船类",
    "401": "工程船",
    "402": "测量船",
    "403": "采沙船",
    "404": "挖泥船",
    "405": "疏浚船",
    "406": "打捞船",
    "407": "打桩船",
    "408": "起重船",
    "409": "搅拌船",
    "410": "布缆船",
    "411": "钻井船",
    "412": "打桩起重船",
    "413": "吹泥船",
    "414": "起重驳",
    "500": "工作船类",
    "501": "工作船",
    "502": "破冰船",
    "503": "航标船",
    "504": "油污水处理船",
    "505": "供给船",
    "506": "垃圾处理船",
    "507": "潜水作业船",
    "600": "拖船类",
    "601": "拖船",
    "602": "推轮",
    "603": "帆船拖船",
    "900": "其它类",
    "901": "交通艇",
    "902": "引航船",
    "903": "救助船",
    "904": "浮船坞",
    "905": "公务船",
    "906": "摩托艇",
    "907": "趸船",
    "908": "游艇",
    "909": "特种用途船",
    "910": "水上平台",
    "911": "水下观光船",
    "912": "科学调查船",
    "913": "勘探船",
    "914": "渔船",
    "915": "军事船",
    "916": "帆船 ",
    "917": "游艇",
    "918": "其它"
}
