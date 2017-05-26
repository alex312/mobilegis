import { isPresent, isBlankString } from './util';
export class THHJUtil {
    static GetTypeName(code: string) {
        let thhj = THHJType[code];

        if (thhj === undefined || thhj === null)
            return "Other";

        let name = thhj.Name;
        if (name === undefined || name === null || name === "")
            return "Other";

        return name;
    }

    static GetTypeDiscribByCode(code: string) {
        let thhj = THHJType[code]
        if (thhj === undefined || thhj === null)
            return "其他";

        let discrib = thhj.Discrib;
        if (discrib === undefined || discrib === null || discrib === "")
            return "Other";

        return discrib;
    }

    static GetTypeDiscribByName(name: string) {
        if (isBlankString(name))
            return "其他"
        for (var key in THHJType) {
            let thhj = THHJType[key];
            if (isPresent(thhj) && thhj.Name === name && isPresent(thhj.Discrib))
                return thhj.Discrib;
        }
        return "其他"
    }
}

const THHJType = {

    "0": {
        "Name": "Obstruction",
        "Discrib": "障碍物"
    },
    "1": {
        "Name": "Berth",
        "Discrib": "泊位"
    },
    "2": {
        "Name": "Lane",
        "Discrib": "航道"
    },
    "3": {
        "Name": "LaneCenterLine",
        "Discrib": "航道中心线"
    },

    "4": {
        "Name": "Anchorage",
        "Discrib": "锚地"
    },
    "5": {
        "Name": "Reportingline",
        "Discrib": "VTS报告线"
    },
    "6": {
        "Name": "Jurisdiction",
        "Discrib": "辖区"
    },
    "7": {
        "Name": "OnBoardArea",
        "Discrib": "引航员登船区"
    },
    "8": {
        "Name": "NavigateAssist",
        "Discrib": "助航设施"
    },
    "9": {
        "Name": "ShallowArea",
        "Discrib": "浅水区"
    },
    "10": {
        "Name": "PortArea",
        "Discrib": "港区"
    },
    "11": {
        "Name": "ShippingLine",
        "Discrib": "推荐航线"
    },
    "12": {
        "Name": "RefPoint",
        "Discrib": "参考点"
    },
    "13": {
        "Name": "Bridge",
        "Discrib": "桥梁"
    },
    "14": {
        "Name": "ShipGate",
        "Discrib": "船闸"
    },
    "15": {
        "Name": "Harbor",
        "Discrib": "港口"
    },
    "16": {
        "Name": "Basin",
        "Discrib": "港池"
    },
    "17": {
        "Name": "RestrictedArea",
        "Discrib": "限制区"
    },
    "18": {
        "Name": "ResponsibilityArea",
        "Discrib": "责任区"
    },
    "19": {
        "Name": "AttentionArea",
        "Discrib": "油田作业区"
    },
    "20": {
        "Name": "InWaterWorkArea",
        "Discrib": "水工作业区"
    },
    "21": {
        "Name": "BerthArea",
        "Discrib": "靠泊区域"
    },
    "22": {
        "Name": "Wharf",
        "Discrib": "码头"
    },
    "23": {
        "Name": "Shipyard",
        "Discrib": "船坞"
    },
    "24": {
        "Name": "Jetty",
        "Discrib": "防波堤"
    },
    "25": {
        "Name": "EmergencyDepot",
        "Discrib": "应急设备库"
    },
    "26": {
        "Name": "PetroleumEP",
        "Discrib": "石油勘探开发设施"
    },
    "27": {
        "Name": "RadarStation",
        "Discrib": "雷达站"
    },
    "28": {
        "Name": "CCTV",
        "Discrib": "CCTV"
    },
    "29": {
        "Name": "VHFStation",
        "Discrib": "VHF基站"
    },
    "30": {
        "Name": "AISStation",
        "Discrib": "AIS基站"
    }
}
