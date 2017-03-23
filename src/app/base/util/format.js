"use strict";
var moment = require('moment');
var Format = (function () {
    function Format() {
    }
    Format.FormatNumber = function (data) {
        return Math.round(data * 100) / 100;
    };
    Format.FormatDate = function (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
    };
    // 格式化经纬度
    // example: utils.formatDegree(lonLat.lon, 'ddd-cc-mm.mmL')
    // example: utils.formatDegree(lonLat.lat, 'dd-cc-mm.mmB')
    // L代表经度，B代表纬度
    Format.FormatDegree = function (deg, style) {
        if (deg === undefined || deg === null || !isFinite(deg)) {
            return '?';
        }
        if (typeof (deg) != 'number') {
            deg = parseFloat(deg);
        }
        // 这里目前只支持两种参数，没有default参数，传入数据必须确保有指定经度还是纬度
        var map = {
            'L': ['E', 'W'],
            'B': ['N', 'S']
        };
        // 截取最后一个字符来区分经纬度，并将其从格式化字符串移除
        var lastIndex = style.length - 1;
        var flag = style.charAt(lastIndex);
        style = style.substring(0, lastIndex);
        // 经纬度最后的字符
        var last;
        if (deg > 0) {
            last = map[flag][0];
        }
        else if (deg < 0) {
            last = map[flag][1];
        }
        else {
            last = '';
        }
        deg = Math.abs(deg);
        // 求得度，分，秒
        var d = Math.floor(deg);
        var diff = (deg - d) * 60;
        var c = Math.floor(diff);
        var m = Math.round((diff - c) * 60 * 100) / 100;
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
        var dSign = "°";
        var cSign = "'";
        var mSign = '"';
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
        }
        else {
            var styles = style.split("-");
            // 用来存储长度
            var len = void 0;
            len = styles[0].length;
            d = this.addLetterToString(d, len, ' ', true);
            len = styles[1].length;
            if (len > 2)
                len = 2;
            c = this.addLetterToString(c, len, '0', true);
            var mStyles = styles[2].split('.');
            len = mStyles[0].length;
            var number = Math.floor(m);
            var mBegin = this.addLetterToString(number, len, '0', true);
            var mEnd = '';
            if (mStyles[1]) {
                var mstr = m.toString();
                mEnd = mstr.substring(mstr.indexOf('.') + 1);
                mEnd = '.' + this.addLetterToString(mEnd, mStyles[1].length, '0', false);
            }
            return d + dSign + c + cSign + mBegin + mEnd + mSign + last;
        }
    };
    ;
    // 向字符串的前面或后面添加指定字符串，当向前添加时，只进行添加操作，当向后添加时，进行截取或添加操作
    Format.addLetterToString = function (str, len, letter, isBefore) {
        str = str.toString();
        var strLen = str.length;
        if (strLen >= len && isBefore) {
            return str;
        }
        else {
            var diff = len - strLen;
            var stack = [];
            for (var i = 0; i < diff; i++) {
                stack.push(letter);
            }
            if (isBefore) {
                return stack.join('') + str;
            }
            else {
                return (str + stack.join('')).substring(0, len);
            }
        }
    };
    ;
    return Format;
}());
exports.Format = Format;
