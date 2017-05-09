import * as moment from 'moment';

export class Format {
    static FormatNumber(data: number) {
        return Math.round(data * 100) / 100;
    }

    static FormatDate(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }

    static FormatData(time, formatStr) {
        return moment(time).format(formatStr);
    }

    // 格式化经纬度
    // example: utils.formatDegree(lonLat.lon, 'ddd-cc-mm.mmL')
    // example: utils.formatDegree(lonLat.lat, 'dd-cc-mm.mmB')
    // L代表经度，B代表纬度
    static FormatDegree(deg, style) {
        if (deg === undefined || deg === null || !isFinite(deg)) {
            return '?';
        }

        if (typeof (deg) != 'number') {
            deg = parseFloat(deg);
        }

        // 这里目前只支持两种参数，没有default参数，传入数据必须确保有指定经度还是纬度
        let map = {
            'L': ['E', 'W'],
            'B': ['N', 'S']
        };

        // 截取最后一个字符来区分经纬度，并将其从格式化字符串移除
        let lastIndex = style.length - 1;
        let flag = style.charAt(lastIndex);
        style = style.substring(0, lastIndex);


        // 经纬度最后的字符
        let last;
        if (deg > 0) {
            last = map[flag][0];
        } else if (deg < 0) {
            last = map[flag][1];
        } else {
            last = '';
        }
        deg = Math.abs(deg);

        // 求得度，分，秒
        let d = Math.floor(deg);
        let diff = (deg - d) * 60;
        let c = Math.floor(diff);
        let m = Math.round((diff - c) * 60 * 100) / 100;
        m = Math.round(m * 100) / 100;
        if (m === 60) {
            c += 1;
            m = 0;
        }
        if (c === 60) {
            d += 1;
            c = 0;
        }

        // 定义度，分，秒的表现形式
        let dSign = "°";
        let cSign = "'";
        let mSign = '"';

        if (style == '' || style == undefined || style == null) {
            if (m === 0) {
                if (c === 0) {
                    if (d === 0)
                        return "0" + dSign;
                    return d + dSign + last;
                }
                return d + dSign + c + cSign + last;
            }


            return d + dSign + c + cSign + m + mSign + last;
        } else {
            let styles = style.split("-");

            // 用来存储长度
            let len;

            len = styles[0].length;
            d = this.addLetterToString(d, len, ' ', true);
            len = styles[1].length;
            if (len > 2) len = 2;
            c = this.addLetterToString(c, len, '0', true);

            let mStyles = styles[2].split('.');
            len = mStyles[0].length;
            let number = Math.floor(m);
            let mBegin = this.addLetterToString(number, len, '0', true);
            let mEnd = '';
            if (mStyles[1]) {
                let mstr = m.toString();
                mEnd = mstr.substring(mstr.indexOf('.') + 1);
                mEnd = '.' + this.addLetterToString(mEnd, mStyles[1].length, '0', false);
            }

            return d + dSign + c + cSign + mBegin + mEnd + mSign + last;
        }
    };

    // 向字符串的前面或后面添加指定字符串，当向前添加时，只进行添加操作，当向后添加时，进行截取或添加操作
    static addLetterToString(str, len, letter, isBefore) {
        str = str.toString();
        let strLen = str.length;
        if (strLen >= len && isBefore) {
            return str;
        } else {
            let diff = len - strLen;
            let stack = [];
            for (let i = 0; i < diff; i++) {
                stack.push(letter);
            }

            if (isBefore) {
                return stack.join('') + str;
            } else {
                return (str + stack.join('')).substring(0, len);
            }
        }
    };
}