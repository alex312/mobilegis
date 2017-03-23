"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    // export function rget(propertyPath, target, defaultTarget?) {
    //     var props = Array.isArray(propertyPath)
    //         ? propertyPath
    //         : propertyPath.split('.');
    //
    //     var v = getPropertyRecursively(props, target);
    //     if (v !== void 0)
    //         return v;
    //
    //     return getPropertyRecursively(props, defaultTarget);
    // }
    //
    // function getPropertyRecursively(properties:string[], target) {
    //     if (!properties.length)
    //         return target;
    //
    //     for (var p of properties) {
    //         if (target == null)
    //             return void 0;
    //
    //         target = target[p];
    //     }
    //     return target;
    // }
    // export var SERVICE_URI = 'api/';
    //
    // export function api(path) {
    //     return SERVICE_URI + path;
    // }

    function uniqueId() {
        exports._uniqueId_prefix = exports._uniqueId_prefix || randomString_();
        exports._uniqueId_serial = exports._uniqueId_serial || 1;
        return exports._uniqueId_prefix + "_" + new Date().getTime() + "_" + exports._uniqueId_serial++;
    }
    exports.uniqueId = uniqueId;
    function dateFromWcfJson(str) {
        var reg = /(\d+)((\+|\-)(\d{2})(\d{2}))?/;
        var match = reg.exec(str);
        if (!match) return null;
        var ticks = match[1] * 1;
        return new Date(ticks);
    }
    exports.dateFromWcfJson = dateFromWcfJson;
    function isPhone(aPhone) {
        return (/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/.test(aPhone)
        );
    }
    exports.isPhone = isPhone;
    function parseIsoTimeSpan(str) {
        var match = /(P(\d+D)?)(T(\d+H)?(\d+M)?(\d+S)?)?/.exec(str);
        var d = parseInt(match[2] || 0, 10);
        var h = parseInt(match[4] || 0, 10);
        var m = parseInt(match[5] || 0, 10);
        var s = parseInt(match[6] || 0, 10);
        return (((d * 24 + h) * 60 + m) * 60 + s) * 1000;
    }
    exports.parseIsoTimeSpan = parseIsoTimeSpan;
    function formatTimeSpan(val) {
        if (!val) return "0秒";
        if (val < 1000) return "<1秒";
        var sect = Math.round(val / 1000);
        var mint = Math.floor(sect / 60);
        var sec = sect - mint * 60;
        var hourt = Math.floor(mint / 60);
        var min = mint - hourt * 60;
        var d = Math.floor(hourt / 24);
        var hour = hourt - d * 24;
        var str = "";
        if (sec) str = sec + "秒" + str;
        if (!mint) return str;
        if (min) str = min + "分钟" + str;
        if (!hourt) return str;
        if (hour) str = hour + "小时" + str;
        if (!d) return str;
        return d + "天" + str;
    }
    exports.formatTimeSpan = formatTimeSpan;
    function randomString_() {
        var str;
        do {
            str = Math.random().toString().substr(2);
        } while (!/^\d{4}\d*$/.test(str));
        return str;
    }
    exports.randomString_ = randomString_;
    function getFormatDataFromURL() {
        var url = window.location.href;
        var data = url.split("?")[1];
        var options = {
            title: '',
            logo: {
                name: '',
                width: ''
            }
        };
        if (data) {
            try {
                data = JSON.parse(decodeURIComponent(data));
                options = data;
            } catch (e) {}
        }
        return options;
    }
    exports.getFormatDataFromURL = getFormatDataFromURL;
    // 生成随机的字符串，用来做ID使用
    function getRandomString(count) {
        var string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var len = string.length;
        var letters = [];
        for (var i = 0; i < count; i++) {
            letters.push(string[Math.floor(Math.random() * len)]);
        }
        return letters.join('');
    }
    exports.getRandomString = getRandomString;
    // 向字符串的前面或后面添加指定字符串，当向前添加时，只进行添加操作，当向后添加时，进行截取或添加操作
    function addLetterToString(str, len, letter, isBefore) {
        str = str.toString();
        var strLen = str.length;
        if (strLen >= len && isBefore) {
            return str;
        } else {
            var diff = len - strLen;
            var stack = [];
            for (var i = 0; i < diff; i++) {
                stack.push(letter);
            }
            if (isBefore) {
                return stack.join('') + str;
            } else {
                return (str + stack.join('')).substring(0, len);
            }
        }
    }
    exports.addLetterToString = addLetterToString;
    // 格式化经纬度
    // example: export function formatDegree(lonLat.lon, 'ddd-cc-mm.mmL')
    // example: export function formatDegree(lonLat.lat, 'dd-cc-mm.mmB')
    // L代表经度，B代表纬度
    function formatDegree(deg, style) {
        if (deg === undefined || deg === null || !isFinite(deg)) {
            return '?';
        }
        if (typeof deg != 'number') {
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
        } else if (deg < 0) {
            last = map[flag][1];
        } else {
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
                    if (d === 0) return "0" + dSign;
                    return d + dSign + last;
                }
                return d + dSign + c + cSign + last;
            }
            return d + dSign + c + cSign + m + mSign + last;
        } else {
            var styles = style.split("-");
            // 用来存储长度
            var len;
            len = styles[0].length;
            d = addLetterToString(d, len, ' ', true);
            len = styles[1].length;
            if (len > 2) len = 2;
            c = addLetterToString(c, len, '0', true);
            var mStyles = styles[2].split('.');
            len = mStyles[0].length;
            var number = Math.floor(m);
            var mBegin = addLetterToString(number, len, '0', true);
            var mEnd = '';
            if (mStyles[1]) {
                m = m.toString();
                mEnd = m.substring(m.indexOf('.') + 1);
                mEnd = '.' + addLetterToString(mEnd, mStyles[1].length, '0', false);
            }
            return d + dSign + c + cSign + mBegin + mEnd + mSign + last;
        }
    }
    exports.formatDegree = formatDegree;
    // 通用的选择框
    /*
     rect = {
     x: 'x',
     y: 'y',
     widht: 'width',
     height: 'height'
     }
     */
    function box(context, rect, strokestyle, linewidth) {
        var l = rect.x,
            t = rect.y;
        var w = rect.width,
            h = rect.height;
        var r = l + w,
            b = t + h;
        var w_3 = w / 3,
            h_3 = h / 3;
        context.beginPath();
        context.moveTo(l, t + h_3);
        context.lineTo(l, t);
        context.lineTo(l + w_3, t);
        context.moveTo(r - w_3, t);
        context.lineTo(r, t);
        context.lineTo(r, t + h_3);
        context.moveTo(r, b - h_3);
        context.lineTo(r, b);
        context.lineTo(r - w_3, b);
        context.moveTo(l + w_3, b);
        context.lineTo(l, b);
        context.lineTo(l, b - h_3);
        context.strokeStyle = strokestyle;
        context.lineWidth = linewidth;
        context.stroke();
    }
    exports.box = box;
    function leftUpRoundRect(context, x, y, w, h, radius, delX, delY) {
        var r = x + w;
        var b = y + h;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(r - radius, y);
        context.quadraticCurveTo(r, y, r, y + radius);
        context.lineTo(r, b - radius);
        context.quadraticCurveTo(r, b, r - radius, b);
        context.lineTo(x + radius, b);
        context.quadraticCurveTo(x, b, x, b - radius);
        context.lineTo(x, y + radius);
        context.lineTo(x - delX, y - delY);
        context.lineTo(x + radius, y);
        context.stroke();
        context.fill();
    }
    exports.leftUpRoundRect = leftUpRoundRect;
    function leftRoundRect(context, x, y, w, h, radius, delta) {
        var r = x + w;
        var b = y + h;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(r - radius, y);
        context.quadraticCurveTo(r, y, r, y + radius);
        context.lineTo(r, b - radius);
        context.quadraticCurveTo(r, b, r - radius, b);
        context.lineTo(x + radius, b);
        context.quadraticCurveTo(x, b, x, b - radius);
        context.lineTo(x - delta, y + h / 2);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.stroke();
        context.fill();
    }
    exports.leftRoundRect = leftRoundRect;
    function roundRect(context, x, y, w, h, radius) {
        var r = x + w;
        var b = y + h;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(r - radius, y);
        context.quadraticCurveTo(r, y, r, y + radius);
        context.lineTo(r, b - radius);
        context.quadraticCurveTo(r, b, r - radius, b);
        context.lineTo(x + radius, b);
        context.quadraticCurveTo(x, b, x, b - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.stroke();
        context.fill();
    }
    exports.roundRect = roundRect;
    // 通用的hover显示框
    function hover(context, x, y, name, items, params) {
        if (items.length < 1) {
            return;
        }
        var lineCount = 0;
        var nameCount = 0;
        if (name) nameCount++;
        items.forEach(function (item) {
            if (item.value) {
                lineCount++;
            }
        });
        var fontSize = 14;
        var smallFontSize = 12;
        var lineSpace = 12;
        var smallLineSpace = 8;
        var boxRadius = params.radius || 10;
        var boxWidth = 200;
        var font = context.font;
        context.font = "bold " + fontSize + "px 宋体";
        var measureWidth = context.measureText(name).width.toFixed(0);
        if (measureWidth > boxWidth) boxWidth = parseInt(measureWidth);
        context.font = smallFontSize + "px 宋体";
        items.forEach(function (item) {
            if (item.value) {
                var text = item.key + "：" + item.value;
                var measureWidth = context.measureText(text).width.toFixed(0);
                if (measureWidth > boxWidth) boxWidth = parseInt(measureWidth);
            }
        });
        var boxHeight = (smallFontSize + smallLineSpace) * lineCount + (fontSize + lineSpace) * nameCount;
        var textLeft = x + boxRadius;
        var textTop = 0;
        var diff = 0;
        if (nameCount) {
            diff = (fontSize + lineSpace) / 2;
        } else {
            diff = (smallFontSize + smallLineSpace) / 2;
        }
        textTop = y + boxRadius + diff;
        var boxX = x;
        var boxY = y;
        if (params.w < x + boxWidth + 2 * boxRadius) {
            textLeft = x - params.deltaX * 2 - boxRadius - boxWidth;
            boxX = textLeft - boxRadius;
        }
        if (params.h < y + boxHeight + 2 * boxRadius) {
            textTop = y - params.deltaY * 2 - boxRadius - boxHeight + diff;
            boxY = textTop - boxRadius - diff;
        }
        context.lineWidth = 1;
        context.strokeStyle = "#800080";
        context.fillStyle = params.fill || 'rgba(255, 255, 255, 0.9)';
        roundRect(context, boxX, boxY, boxWidth + 2 * boxRadius, boxHeight + 2 * boxRadius, boxRadius);
        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context.fillStyle = '#000080';
        context.textAlign = "left";
        var textBaseline = context.textBaseline;
        context.textBaseline = "middle";
        if (name) {
            context.font = "bold " + fontSize + "px 宋体";
            context.fillText(name, textLeft, textTop);
            context.stroke();
            textTop += (fontSize + lineSpace + smallFontSize + smallLineSpace) / 2;
        }
        context.font = smallFontSize + "px 宋体";
        items.forEach(function (item) {
            if (item.value) {
                context.fillText(item.key + "：" + item.value, textLeft, textTop);
                textTop += smallFontSize + smallLineSpace;
            }
        });
        context.stroke();
        // reset some styles
        context.font = font;
        context.textBaseline = textBaseline;
    }
    exports.hover = hover;
    // 依据mmsi获取国家名称
    function getMmsiNation(mmsi) {
        mmsi = "" + mmsi;
        if (!/^\d{9}$/.test(mmsi)) return null;
        var gj = mmsi.substring(0, 3);
        switch (gj) {
            case '201':
                return "阿尔巴尼亚"; // "Albania (Republic of)";
            case '202':
                return "安道尔"; // "Andorra (Principality of)";
            case '203':
                return "奥地利"; // "Austria";
            case '204':
                return "葡萄牙"; //"Azores - Portugal";
            case '205':
                return "比利时"; //"Belgium";
            case '206':
                return "白俄罗斯"; //"Belarus (Republic of)";
            case '207':
                return "保加利亚"; //"Bulgaria (Republic of)";
            case '208':
                return "梵蒂冈城国"; //"Vatican City State";
            case '209':
                return "塞浦路斯"; //"Cyprus (Republic of)";
            case '210':
                return "塞浦路斯"; //"Cyprus (Republic of)";
            case '211':
                return "德国"; //"Germany (Federal Republic of)";
            case '212':
                return "塞浦路斯"; //"Cyprus (Republic of)";
            case '213':
                return "格鲁吉亚"; //"Georgia";
            case '214':
                return "摩尔多瓦"; //"Moldova (Republic of)";
            case '215':
                return "马耳他"; //"Malta";
            case '216':
                return "亚美尼亚"; //"Armenia (Republic of)";
            case '218':
                return "德国"; //"Germany (Federal Republic of)";
            case '219':
                return "丹麦"; //"Denmark";
            case '220':
                return "丹麦"; //"Denmark";
            case '224':
                return "西班牙"; //"Spain";
            case '225':
                return "西班牙"; //"Spain";
            case '226':
                return "法国"; //"France";
            case '227':
                return "法国"; //"France";
            case '228':
                return "法国"; //"France";
            case '229':
                return "马耳他"; //"Malta";
            case '230':
                return "芬兰"; //"Finland";
            case '231':
                return "丹麦"; //"Faroe Islands - Denmark";
            case '232':
                return "英国"; //"United Kingdom of Great Britain and Northern Ireland";
            case '233':
                return "英国"; //"United Kingdom of Great Britain and Northern Ireland";
            case '234':
                return "英国"; //"United Kingdom of Great Britain and Northern Ireland";
            case '235':
                return "英国"; //"United Kingdom of Great Britain and Northern Ireland";
            case '236':
                return "英国"; //"Gibraltar - United Kingdom of Great Britain and Northern Ireland";
            case '237':
                return "希腊"; //"Greece";
            case '238':
                return "克罗地亚"; //"Croatia (Republic of)";
            case '239':
                return "希腊"; //"Greece";
            case '240':
                return "希腊"; //"Greece";
            case '241':
                return "希腊"; //"Greece";
            case '242':
                return "摩洛哥"; //"Morocco (Kingdom of)";
            case '243':
                return "匈牙利"; //"Hungary";
            case '244':
                return "荷兰"; //"Netherlands (Kingdom of the)";
            case '245':
                return "荷兰"; //"Netherlands (Kingdom of the)";
            case '246':
                return "荷兰"; //"Netherlands (Kingdom of the)";
            case '247':
                return "意大利"; //"Italy";
            case '248':
                return "马耳他"; //"Malta";
            case '249':
                return "马耳他"; //"Malta";
            case '250':
                return "爱尔兰"; //"Ireland";
            case '251':
                return "冰岛"; //"Iceland";
            case '252':
                return "列支敦士登"; //"Liechtenstein (Principality of)";
            case '253':
                return "卢森堡"; //"Luxembourg";
            case '254':
                return "摩纳哥"; //"Monaco (Principality of)";
            case '255':
                return "葡萄牙"; //"Madeira - Portugal";
            case '256':
                return "马耳他"; //"Malta";
            case '257':
                return "挪威"; //"Norway";
            case '258':
                return "挪威"; //"Norway";
            case '259':
                return "挪威"; //"Norway";
            case '261':
                return "波兰"; //"Poland (Republic of)";
            case '262':
                return "黑山"; //"Montenegro";
            case '263':
                return "葡萄牙"; //"Portugal";
            case '264':
                return "罗马尼亚"; //"Romania";
            case '265':
                return "瑞典"; //"Sweden";
            case '266':
                return "瑞典"; //"Sweden";
            case '267':
                return "斯洛伐克"; //"Slovak Republic";
            case '268':
                return "圣马力诺"; //"San Marino (Republic of)";
            case '269':
                return "瑞士"; //"Switzerland (Confederation of)";
            case '270':
                return "捷克"; //"Czech Republic";
            case '271':
                return "土耳其"; //"Turkey";
            case '272':
                return "乌克兰"; //"Ukraine";
            case '273':
                return "俄罗斯"; //"Russian Federation";
            case '274':
                return "前南斯拉夫的马其顿共和国"; //"The Former Yugoslav Republic of Macedonia";
            case '275':
                return "拉脱维亚"; //"Latvia (Republic of)";
            case '276':
                return "爱沙尼亚"; //"Estonia (Republic of)";
            case '277':
                return "立陶宛"; //"Lithuania (Republic of)";
            case '278':
                return "斯洛文尼亚"; //"Slovenia (Republic of)";
            case '279':
                return "塞尔维亚"; //"Serbia (Republic of)";
            case '301':
                return "英国"; //"Anguilla - United Kingdom of Great Britain and Northern Ireland";
            case '303':
                return "美国"; //"Alaska (State of) - United States of America";
            case '304':
                return "安提瓜和巴布达"; //"Antigua and Barbuda";
            case '305':
                return "安提瓜和巴布达"; //"Antigua and Barbuda";
            case '306':
                return "荷兰"; //"Sint Maarten (Dutch part) - Netherlands (Kingdom of the) / Cura?ao - Netherlands (Kingdom of the) / Bonaire, Sint Eustatius and Saba - Netherlands (Kingdom of the)";
            case '307':
                return "荷兰"; //"Aruba - Netherlands (Kingdom of the)";
            case '308':
                return "巴哈马"; //"Bahamas (Commonwealth of the)";
            case '309':
                return "巴哈马"; //"Bahamas (Commonwealth of the)";
            case '310':
                return "英国"; //"Bermuda - United Kingdom of Great Britain and Northern Ireland";
            case '311':
                return "巴哈马"; //"Bahamas (Commonwealth of the)";
            case '312':
                return "伯利兹"; //"Belize";
            case '314':
                return "巴巴多斯"; //"Barbados";
            case '316':
                return "加拿大"; //"Canada";
            case '319':
                return "英国"; //"Cayman Islands - United Kingdom of Great Britain and Northern Ireland";
            case '321':
                return "哥斯达黎加"; //"Costa Rica";
            case '323':
                return "古巴"; //"Cuba";
            case '325':
                return "多米尼加"; //"Dominica (Commonwealth of)";
            case '327':
                return "多米尼加"; //"Dominican Republic";
            case '329':
                return "法国"; //"Guadeloupe (French Department of) - France";
            case '330':
                return "格林纳达"; //"Grenada";
            case '331':
                return "格陵兰"; //"Greenland - Denmark";
            case '332':
                return "危地马拉"; //"Guatemala (Republic of)";
            case '334':
                return "洪都拉斯"; //"Honduras (Republic of)";
            case '336':
                return "海地"; //"Haiti (Republic of)";
            case '338':
                return "美国"; //"United States of America";
            case '339':
                return "牙买加"; //"Jamaica";
            case '341':
                return "圣基茨和尼维斯"; //"Saint Kitts and Nevis (Federation of)";
            case '343':
                return "圣卢西亚"; //"Saint Lucia";
            case '345':
                return "墨西哥"; //"Mexico";
            case '347':
                return "法国"; //"Martinique (French Department of) - France";
            case '348':
                return "英国"; //"Montserrat - United Kingdom of Great Britain and Northern Ireland";
            case '350':
                return "尼加拉瓜"; //"Nicaragua";
            case '351':
                return "巴拿马"; //"Panama (Republic of)";
            case '352':
                return "巴拿马"; //"Panama (Republic of)";
            case '353':
                return "巴拿马"; //"Panama (Republic of)";
            case '354':
                return "巴拿马"; //"Panama (Republic of)";
            case '355':
                return null;
            case '356':
                return null;
            case '357':
                return null;
            case '358':
                return "美国"; //"Puerto Rico - United States of America";
            case '359':
                return "萨尔瓦多"; //"El Salvador (Republic of)";
            case '361':
                return "法国"; //"Saint Pierre and Miquelon (Territorial Collectivity of) - France";
            case '362':
                return "特立尼达和多巴哥"; //"Trinidad and Tobago";
            case '364':
                return "英国"; //"Turks and Caicos Islands - United Kingdom of Great Britain and Northern Ireland";
            case '366':
                return "美国"; //"United States of America";
            case '367':
                return "美国"; //"United States of America";
            case '368':
                return "美国"; //"United States of America";
            case '369':
                return "美国"; //"United States of America";
            case '370':
                return "巴拿马"; //"Panama (Republic of)";
            case '371':
                return "巴拿马"; //"Panama (Republic of)";
            case '372':
                return "巴拿马"; //"Panama (Republic of)";
            case '373':
                return "巴拿马"; //"Panama (Republic of)";
            case '375':
                return "圣文森特和格林纳丁斯"; //"Saint Vincent and the Grenadines";
            case '376':
                return "圣文森特和格林纳丁斯"; //"Saint Vincent and the Grenadines";
            case '377':
                return "圣文森特和格林纳丁斯"; //"Saint Vincent and the Grenadines";
            case '378':
                return "英属维尔京群岛 - 英国"; //"British Virgin Islands - United Kingdom of Great Britain and Northern Ireland";
            case '379':
                return "美国"; //"United States Virgin Islands - United States of America";
            case '401':
                return "阿富汗"; //"Afghanistan";
            case '403':
                return "沙特阿拉伯"; //"Saudi Arabia (Kingdom of)";
            case '405':
                return "孟加拉国"; //"Bangladesh (People's Republic of)";
            case '408':
                return "巴林"; //"Bahrain (Kingdom of)";
            case '410':
                return "不丹"; //"Bhutan (Kingdom of)";
            case '412':
                return "中国"; //"China (People's Republic of)";
            case '413':
                return "中国"; //"China (People's Republic of)";
            case '414':
                return "中国"; //"China (People's Republic of)";
            case '416':
                return "中国"; //"Taiwan (Province of China) - China (People's Republic of)";
            case '417':
                return "斯里兰卡"; //"Sri Lanka (Democratic Socialist Republic of)";
            case '419':
                return "印度"; //"India (Republic of)";
            case '422':
                return "伊朗"; //"Iran (Islamic Republic of)";
            case '423':
                return "阿塞拜疆"; //"Azerbaijani Republic";
            case '425':
                return "伊拉克"; //"Iraq (Republic of)";
            case '428':
                return "以色列"; //"Israel (State of)";
            case '431':
                return "日本"; //"Japan";
            case '432':
                return "日本"; //"Japan";
            case '434':
                return "土库曼斯坦"; //"Turkmenistan";
            case '436':
                return "哈萨克斯坦"; //"Kazakhstan (Republic of)";
            case '437':
                return "乌兹别克斯坦"; //"Uzbekistan (Republic of)";
            case '438':
                return "约旦"; //"Jordan (Hashemite Kingdom of)";
            case '440':
                return "韩国"; //"Korea (Republic of)";
            case '441':
                return "韩国"; //"Korea (Republic of)";
            case '443':
                return "巴勒斯坦"; //"State of Palestine (In accordance with Resolution 99 Rev. Guadalajara, 2010)";
            case '445':
                return "朝鲜"; //"Democratic People's Republic of Korea";
            case '447':
                return "科威特"; //"Kuwait (State of)";
            case '450':
                return "黎巴嫩"; //"Lebanon";
            case '451':
                return "吉尔吉斯斯坦"; //"Kyrgyz Republic";
            case '453':
                return "中国"; //"Macao (Special Administrative Region of China) - China (People's Republic of)";
            case '455':
                return "马尔代夫"; //"Maldives (Republic of)";
            case '457':
                return "蒙古"; //"Mongolia";
            case '459':
                return "尼泊尔"; //"Nepal (Federal Democratic Republic of)";
            case '461':
                return "苏丹"; //"Oman (Sultanate of)";
            case '463':
                return "巴基斯坦"; //"Pakistan (Islamic Republic of)";
            case '466':
                return "卡塔尔"; //"Qatar (State of)";
            case '468':
                return "叙利亚"; //"Syrian Arab Republic";
            case '470':
                return "阿拉伯联合酋长国"; //"United Arab Emirates";
            case '472':
                return "塔吉克斯坦"; //"Tajikistan (Republic of)";
            case '473':
                return "也门"; //"Yemen (Republic of)";
            case '475':
                return "也门"; //"Yemen (Republic of)";
            case '477':
                return "中国"; //"Hong Kong (Special Administrative Region of China) - China (People's Republic of)";
            case '478':
                return "波斯尼亚和黑塞哥维那"; //"Bosnia and Herzegovina";
            case '501':
                return "法国"; //"Adelie Land - France";
            case '503':
                return "澳大利亚"; //"Australia";
            case '506':
                return "缅甸"; //"Myanmar (Union of)";
            case '508':
                return "文莱"; //"Brunei Darussalam";
            case '510':
                return "密克罗尼西亚"; //"Micronesia (Federated States of)";
            case '511':
                return "帕劳"; //"Palau (Republic of)";
            case '512':
                return "新西兰"; //"New Zealand";
            case '514':
                return "柬埔寨"; //"Cambodia (Kingdom of)";
            case '515':
                return "柬埔寨"; //"Cambodia (Kingdom of)";
            case '516':
                return "澳大利亚"; //"Christmas Island (Indian Ocean) - Australia";
            case '518':
                return "新西兰"; //"Cook Islands - New Zealand";
            case '520':
                return "斐济"; //"Fiji (Republic of)";
            case '523':
                return "澳大利亚"; //"Cocos (Keeling) Islands - Australia";
            case '525':
                return "印度尼西亚"; //"Indonesia (Republic of)";
            case '529':
                return "基里巴斯"; //"Kiribati (Republic of)";
            case '531':
                return "老挝"; //"Lao People's Democratic Republic";
            case '533':
                return "马来西亚"; //"Malaysia";
            case '536':
                return "美国"; //"Northern Mariana Islands (Commonwealth of the) - United States of America";
            case '538':
                return "马绍尔群岛"; //"Marshall Islands (Republic of the)";
            case '540':
                return "法国"; //"New Caledonia - France";
            case '542':
                return "新西兰"; //"Niue - New Zealand";
            case '544':
                return "瑙鲁"; //"Nauru (Republic of)";
            case '546':
                return "法国"; //"French Polynesia - France";
            case '548':
                return "菲律宾"; //"Philippines (Republic of the)";
            case '553':
                return "巴布亚新几内亚"; //"Papua New Guinea";
            case '555':
                return "英国"; //"Pitcairn Island - United Kingdom of Great Britain and Northern Ireland";
            case '557':
                return "所罗门群岛"; //"Solomon Islands";
            case '559':
                return "美国"; //"American Samoa - United States of America";
            case '561':
                return "萨摩亚"; //"Samoa (Independent State of)";
            case '563':
                return "新加坡"; //"Singapore (Republic of)";
            case '564':
                return "新加坡"; //"Singapore (Republic of)";
            case '565':
                return "新加坡"; //"Singapore (Republic of)";
            case '566':
                return "新加坡"; //"Singapore (Republic of)";
            case '567':
                return "泰国"; //"Thailand";
            case '570':
                return "汤加"; //"Tonga (Kingdom of)";
            case '572':
                return "图瓦卢"; //"Tuvalu";
            case '574':
                return "越南"; //"Viet Nam (Socialist Republic of)";
            case '576':
                return "瓦努阿图"; //"Vanuatu (Republic of)";
            case '577':
                return "瓦努阿图"; //"Vanuatu (Republic of)";
            case '578':
                return "法国"; //"Wallis and Futuna Islands - France";
            case '601':
                return "南非"; //"South Africa (Republic of)";
            case '603':
                return "安哥拉"; //"Angola (Republic of)";
            case '605':
                return "阿尔及利亚"; //"Algeria (People's Democratic Republic of)";
            case '607':
                return "法国"; //"Saint Paul and Amsterdam Islands - France";
            case '608':
                return "英国"; //"Ascension Island - United Kingdom of Great Britain and Northern Ireland";
            case '609':
                return "布隆迪"; //"Burundi (Republic of)";
            case '610':
                return "贝宁"; //"Benin (Republic of)";
            case '611':
                return "博茨瓦纳"; //"Botswana (Republic of)";
            case '612':
                return "中非"; //"Central African Republic";
            case '613':
                return "喀麦隆"; //"Cameroon (Republic of)";
            case '615':
                return "刚果"; //"Congo (Republic of the)";
            case '616':
                return "科摩罗"; //"Comoros (Union of the)";
            case '617':
                return "佛得角"; //"Cape Verde (Republic of)";
            case '618':
                return "法国"; //"Crozet Archipelago - France";
            case '619':
                return "科特迪瓦"; //"C?te d'Ivoire (Republic of)";
            case '620':
                return "科摩罗"; //"Comoros (Union of the)";
            case '621':
                return "吉布提"; //"Djibouti (Republic of)";
            case '622':
                return "埃及"; //"Egypt (Arab Republic of)";
            case '624':
                return "埃塞俄比亚"; //"Ethiopia (Federal Democratic Republic of)";
            case '625':
                return "厄立特里亚"; //"Eritrea";
            case '626':
                return "加蓬"; //"Gabonese Republic";
            case '627':
                return "加纳"; //"Ghana";
            case '629':
                return "冈比亚"; //"Gambia (Republic of the)";
            case '630':
                return "几内亚比绍"; //"Guinea-Bissau (Republic of)";
            case '631':
                return "赤道几内亚"; //"Equatorial Guinea (Republic of)";
            case '632':
                return "几内亚"; //"Guinea (Republic of)";
            case '633':
                return "布基纳法索"; //"Burkina Faso";
            case '634':
                return "肯尼亚"; //"Kenya (Republic of)";
            case '635':
                return "法国"; //"Kerguelen Islands - France";
            case '636':
                return "利比里亚"; //"Liberia (Republic of)";
            case '637':
                return "利比里亚"; //"Liberia (Republic of)";
            case '642':
                return "利比亚"; //"Libya";
            case '644':
                return "莱索托"; //"Lesotho (Kingdom of)";
            case '645':
                return "毛里求斯"; //"Mauritius (Republic of)";
            case '647':
                return "马达加斯加"; //"Madagascar (Republic of)";
            case '649':
                return "马里"; //"Mali (Republic of)";
            case '650':
                return "莫桑比克"; //"Mozambique (Republic of)";
            case '654':
                return "毛里塔尼亚"; //"Mauritania (Islamic Republic of)";
            case '655':
                return "马拉维"; //"Malawi";
            case '656':
                return "尼日尔"; //"Niger (Republic of the)";
            case '657':
                return "尼日利亚"; //"Nigeria (Federal Republic of)";
            case '659':
                return "纳米比亚"; //"Namibia (Republic of)";
            case '660':
                return "法国"; //"Reunion (French Department of) - France";
            case '661':
                return "卢旺达"; //"Rwanda (Republic of)";
            case '662':
                return "苏丹"; //"Sudan (Republic of the)";
            case '663':
                return "塞内加尔"; //"Senegal (Republic of)";
            case '664':
                return "塞舌尔"; //"Seychelles (Republic of)";
            case '665':
                return "英国"; //"Saint Helena - United Kingdom of Great Britain and Northern Ireland";
            case '666':
                return "索马里"; //"Somali Democratic Republic";
            case '667':
                return "塞拉利昂"; //"Sierra Leone";
            case '668':
                return "圣多美和普林西比"; //"Sao Tome and Principe (Democratic Republic of)";
            case '669':
                return "斯威士兰"; //"Swaziland (Kingdom of)";
            case '670':
                return "乍得"; //"Chad (Republic of)";
            case '671':
                return "多哥"; //"Togolese Republic";
            case '672':
                return "突尼斯"; //"Tunisia";
            case '674':
                return "坦桑尼亚"; //"Tanzania (United Republic of)";
            case '675':
                return "乌干达"; //"Uganda (Republic of)";
            case '676':
                return "刚果"; //"Democratic Republic of the Congo";
            case '677':
                return "坦桑尼亚"; //"Tanzania (United Republic of)";
            case '678':
                return "赞比亚"; //"Zambia (Republic of)";
            case '679':
                return "津巴布韦"; //"Zimbabwe (Republic of)";
            case '701':
                return "阿根廷"; //"Argentine Republic";
            case '710':
                return "巴西"; //"Brazil (Federative Republic of)";
            case '720':
                return "玻利维亚"; //"Bolivia (Plurinational State of)";
            case '725':
                return "智利"; //"Chile";
            case '730':
                return "哥伦比亚"; //"Colombia (Republic of)";
            case '735':
                return "厄瓜多尔"; //"Ecuador";
            case '740':
                return "英国"; //"Falkland Islands (Malvinas) - United Kingdom of Great Britain and Northern Ireland";
            case '745':
                return "法国"; //"Guiana (French Department of) - France";
            case '750':
                return "圭亚那"; //"Guyana";
            case '755':
                return "巴拉圭"; //"Paraguay (Republic of)";
            case '760':
                return "秘鲁"; //"Peru";
            case '765':
                return "苏里南"; //"Suriname (Republic of)";
            case '770':
                return "乌拉圭"; //"Uruguay (Eastern Republic of)";
            case '775':
                return "委内瑞拉"; //"Venezuela (Bolivarian Republic of)";
            default:
                {
                    if (gj.substring(0, 1) === "9") return "中国";
                    return null;
                }
        }
    }
    exports.getMmsiNation = getMmsiNation;
    exports.blankImage = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAA" + "fFcSJAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTl" + "MA/1uRIrUAAAALSURBVHicY2AAAgAABQABel6rP" + "wAAAABJRU5ErkJggg==";

    var RepeatingAjax = function () {
        function RepeatingAjax(params) {
            _classCallCheck(this, RepeatingAjax);

            this.delay = params.delay || Number.MAX_VALUE;
            this.interval = params.interval || Number.MAX_VALUE;
            this.done = params.done || function () {};
            this.fail = params.fail || function () {};
            this.context = params.context || null;
            this.options = params.options || null;
            this._userState = params.userState || null;
            this._timer = null;
            this._ajax = null;
            this._timer = window.setTimeout($.proxy(this.onTimer, this), this.delay);
        }

        _createClass(RepeatingAjax, [{
            key: "destroy",
            value: function destroy() {
                if (this._timer) {
                    window.clearTimeout(this._timer);
                    this._timer = null;
                }
                if (this._ajax) {
                    this._ajax.abort();
                    this._ajax = null;
                }
            }
        }, {
            key: "onTimer",
            value: function onTimer() {
                this._timer = null;
                var options = typeof this.options == "function" ? this.options.apply(this.context) : this.options;
                options = options || { ajax: null, userState: null };
                var ajaxOptions = $.extend({}, options.ajax || null, { context: this });
                this._userState = options.userState || null;
                this._ajax = $.ajax(ajaxOptions);
                this._ajax.done(this.onAjaxDone);
                this._ajax.fail(this.onAjaxFail);
            }
        }, {
            key: "onAjaxDone",
            value: function onAjaxDone(data) {
                this._ajax = null;
                var args = this._userState ? [this._userState] : [];
                args = args.concat.apply(args, arguments);
                this.done.apply(this.context, args);
                this._userState = null;
                this._timer = window.setTimeout($.proxy(this.onTimer, this), this.interval);
            }
        }, {
            key: "onAjaxFail",
            value: function onAjaxFail(jqXHR, textStatus, errorThrown) {
                this._ajax = null;
                if (textStatus === 'abort') return;
                var args = this._userState ? [this._userState] : [];
                args = args.concat.apply(args, arguments);
                this.fail.apply(this.context, args);
                this._userState = null;
                this._timer = window.setTimeout($.proxy(this.onTimer, this), this.interval);
            }
        }]);

        return RepeatingAjax;
    }();

    exports.RepeatingAjax = RepeatingAjax;
    function fromWcfJson(str) {
        var reg = /(\d+)((\+|\-)(\d{2})(\d{2}))?/;
        var match = reg.exec(str);
        if (!match) return null;
        var ticks = match[1] * 1;
        return new Date(ticks);
    }
    exports.fromWcfJson = fromWcfJson;
    function getIconBaseUrl(type) {
        return "api/icon/images?type=" + type + "&id=";
    }
    exports.getIconBaseUrl = getIconBaseUrl;
    function scremoveAll(arr, item) {
        var ind = 0;
        while (true) {
            ind = arr.indexOf(item, ind);
            if (ind < 0) return;
            arr.splice(ind, 1);
        }
    }
    exports.scremoveAll = scremoveAll;

    var Rect = function () {
        function Rect(x, y, width, height) {
            _classCallCheck(this, Rect);

            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        _createClass(Rect, [{
            key: "contains",
            value: function contains(x, y) {
                return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
            }
        }, {
            key: "toString",
            value: function toString() {
                return "" + this.x + "," + this.y + "," + this.width + "," + this.height;
            }
        }, {
            key: "clone",
            value: function clone() {
                return new Rect(this.x, this.y, this.width, this.height);
            }
        }]);

        return Rect;
    }();

    exports.Rect = Rect;
    function Polygon(pointArray) {
        var _data = pointArray;
        var _box = null;
        if (!pointArray || pointArray.length < 2 * 3 || pointArray.length % 2) throw '多边形顶点数组长度必须为偶数且大于 6.';
        // 根据x方向和y方向上的缩放系数进行缩放，同时根据弧度进行逆时针旋转
        this.tranform = function (scaleX, scaleY, angle) {
            for (var i = 0; i < _data.length; i += 2) {
                var x = _data[i] * scaleX;
                var y = _data[i + 1] * scaleY;
                _data[i] = x * Math.cos(angle) - y * Math.sin(angle);
                _data[i + 1] = x * Math.sin(angle) + y * Math.cos(angle);
            }
            _box = null;
            return this;
        };
        // 获取图形的最小x、y坐标和最大x、y坐标，然后以最小坐标作为起点做了一个矩形
        this.box = function () {
            if (_box) return _box;
            var l = 0,
                t = 0,
                r = 0,
                b = 0;
            for (var i = 0; i < _data.length;) {
                var x = _data[i++];
                var y = _data[i++];
                if (x < l) l = x;
                if (x > r) r = x;
                if (y < t) t = y;
                if (y > b) b = y;
            }
            return _box = new Rect(l, t, r - l, b - t);
        };
        function point_on_which_side_of_line(x, y, pt0x, pt0y, pt1x, pt1y) {
            var d0x = pt1x - pt0x;
            var d0y = pt1y - pt0y;
            var d1x = x - pt0x;
            var d1y = y - pt0y;
            var k = d0x * d1y - d0y * d1x;
            return k;
        }
        function are_line_segments_intersecting_and_noncollinear(v1x1, v1y1, v1x2, v1y2, v2x1, v2y1, v2x2, v2y2) {
            var d11 = point_on_which_side_of_line(v2x1, v2y1, v1x1, v1y1, v1x2, v1y2);
            var d12 = point_on_which_side_of_line(v2x2, v2y2, v1x1, v1y1, v1x2, v1y2);
            if (d11 > 0 && d12 > 0) return false;
            if (d11 < 0 && d12 < 0) return false;
            var d21 = point_on_which_side_of_line(v1x1, v1y1, v2x1, v2y1, v2x2, v2y2);
            var d22 = point_on_which_side_of_line(v1x2, v1y2, v2x1, v2y1, v2x2, v2y2);
            if (d21 > 0 && d22 > 0) return false;
            if (d21 < 0 && d22 < 0) return false;
            if (d11 === 0 && d12 === 0 && d21 === 0 && d22 === 0) return false;
            return true;
        }
        this.contains = function (x, y) {
            if (_data.length === 0) return false;
            var box = this.box();
            if (!box.contains(x, y)) return false;
            var x1 = x;
            var y1 = box.y - box.height;
            var intersects = 0;
            var pt0x = _data[_data.length - 2];
            var pt0y = _data[_data.length - 1];
            for (var i = 0; i < _data.length;) {
                var pt1x = _data[i++];
                var pt1y = _data[i++];
                if (are_line_segments_intersecting_and_noncollinear(pt0x, pt0y, pt1x, pt1y, x, y, x1, y1)) intersects++;
                pt0x = pt1x;
                pt0y = pt1y;
            }
            return intersects % 2 === 1;
        };
        this.draw = function (context, borderColor, fillColor) {
            if (_data.length === 0) return;
            context.strokeStyle = borderColor;
            context.fillStyle = fillColor;
            context.beginPath();
            context.moveTo(_data[0], _data[1]);
            for (var pti = 2; pti < _data.length;) {
                var x = _data[pti++];
                var y = _data[pti++];
                context.lineTo(x, y);
            }
            context.lineTo(_data[0], _data[1]);
            context.closePath();
            context.fill();
            context.stroke();
        };
        this.clone = function () {
            return new Polygon(_data.slice() /*, _radius*/);
        };
        this.points = function () {
            return _data.slice();
        };
        this.toString = function () {
            var str = "";
            for (var i = 0; i < _data.length;) {
                str += _data[i++] + ",";
                str += _data[i++] + "; ";
            }
            str += " # ";
            str += this.box().toString();
            return str;
        };
    }
    exports.Polygon = Polygon;
    function Circular(radius) {
        var _radius = radius;
        if (_radius < 0) _radius = 0;
        var _box = null;
        this.box = function () {
            if (_box) return _box;
            var l = -_radius,
                t = -_radius,
                r = _radius,
                b = _radius;
            return _box = new Rect(l, t, r - l, b - t);
        };
        this.draw = function (context, borderColor, fillColor) {
            if (_radius === 0) return;
            context.strokeStyle = borderColor;
            context.fillStyle = fillColor;
            if (_radius) {
                context.beginPath();
                context.arc(0, 0, _radius, 2 * Math.PI, false);
                context.closePath();
                context.fill();
                context.stroke();
            }
        };
        this.clone = function () {
            return new Circular(_radius);
        };
        this.toString = function () {
            var str = "";
            str += " # ";
            str += this.box().toString();
            return str;
        };
    }
    exports.Circular = Circular;

    var LLBounds = function () {
        function LLBounds(west, south, east, north) {
            _classCallCheck(this, LLBounds);

            this.west = 0;
            this.south = 0;
            this.east = 0;
            this.north = 0;
            this.west = arguments[0] || 0;
            this.south = arguments[1] || 0;
            this.east = arguments[2] || 0;
            this.north = arguments[3] || 0;
        }

        _createClass(LLBounds, [{
            key: "toString",
            value: function toString() {
                return [this.west, this.north, this.east, this.south].join(',');
            }
        }]);

        return LLBounds;
    }();

    exports.LLBounds = LLBounds;
    function Map(items) {
        var _items = items || {};
        this.item = function (code, value) {
            if (value === undefined) {
                var v = _items[code];
                if (v === undefined) {
                    v = _items[''];
                }
                return v;
            }
            _items[code] = value;
        };
    }
    exports.Map = Map;
    function MapMap() {
        var _maps = {};
        this.add = function (type, map) {
            _maps[type] = new Map(map);
        };
        this.item = function (type, code) {
            var m = _maps[type];
            if (!m) return undefined;
            return m.item(code);
        };
    }
    exports.MapMap = MapMap;
    function degreeToDecimal(lonlat) {
        var lonlats = /(\d+°)?(\d+')?(\d+(\.\d+)?")?/.exec(lonlat);
        var deg = lonlats[1] === undefined ? "0°" : lonlats[1];
        var minute = lonlats[2] === undefined ? "0'" : lonlats[2];
        var second = lonlats[3] === undefined ? '0"' : lonlats[3];
        deg = parseFloat(deg.substr(0, deg.length - 1));
        minute = parseFloat(minute.substr(0, minute.length - 1));
        second = parseFloat(second.substr(0, second.length - 1));
        var decimal = deg + minute / 60 + second / 3600;
        var symbol = lonlat.substr(lonlat.length - 1);
        if (symbol === "W" || symbol === "S") decimal = decimal * -1;
        return decimal;
    }
    exports.degreeToDecimal = degreeToDecimal;
    function colorRgb(color, opacity) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = color.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
        } else {
            return sColor;
        }
    }
    exports.colorRgb = colorRgb;
    var ais_ship_types_ = {
        '20': '地效翼船',
        '21': '地效翼船',
        '22': '地效翼船',
        '23': '地效翼船',
        '24': '地效翼船',
        '29': '地效翼船',
        '30': '帆船渔船',
        '31': '帆船拖船',
        '32': '帆船拖船',
        '33': '帆船',
        '34': '帆船',
        '35': '帆船',
        '36': '帆船',
        '37': '帆船游艇',
        '40': '高速船',
        '41': '高速船',
        '42': '高速船',
        '43': '高速船',
        '44': '高速船',
        '49': '高速船',
        '50': '引航船',
        '51': '搜救船',
        '52': '拖船',
        '53': '港口供应船',
        '54': '防污染作业船',
        '55': '执法船',
        '60': '客船',
        '61': '客船',
        '62': '客船',
        '63': '客船',
        '64': '客船',
        '69': '客船',
        '70': '货船',
        '71': '货船',
        '72': '货船',
        '73': '货船',
        '74': '货船',
        '79': '货船',
        '80': '油船',
        '81': '油船',
        '82': '油船',
        '83': '油船',
        '84': '油船',
        '89': '油船',
        '90': '其它类型船',
        '91': '其它类型船',
        '92': '其它类型船',
        '93': '其它类型船',
        '94': '其它类型船'
    };
    function getAisShipTypeName(code) {
        var name = ais_ship_types_[code];
        return name || '--';
    }
    exports.getAisShipTypeName = getAisShipTypeName;
    function getAisNavStatusName(code) {
        var values = ['用主机航行', '锚泊', '失控', '操纵性受限', '吃水限制', '系泊', '搁浅', '从事捕捞', '驶风航行'];
        var defval = "未知";
        var ind = parseInt(code);
        if (!isFinite(ind) || ind < 0 || ind >= values.length) return defval;
        return values[ind];
    }
    exports.getAisNavStatusName = getAisNavStatusName;
    function globalTooltip(msg) {
        $(".global-tooltip").remove();
        var id = getRandomString(8);
        var div = $(document.createElement('div')).attr("id", id).addClass('global-tooltip');
        $('<div>' + msg + '</div>').appendTo(div);
        $(document.body).append(div);
        window.setTimeout(function () {
            $("#" + id).css('opacity', '0.5');
        }, 2000);
        window.setTimeout(function () {
            $("#" + id).remove();
        }, 3000);
    }
    exports.globalTooltip = globalTooltip;
    function WrapText(text, length) {
        var result = '';
        var arr = text.split(' ');
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            if (i !== 0) {
                result += ' ';
            }
            var diff = item.length / length;
            if (diff > 1) {
                var count = Math.round(diff);
                if (count < diff) {
                    count++;
                }
                for (var j = 0; j < count; j++) {
                    if (j !== count - 1) {
                        result += item.slice(j * length, j * count + length) + '\r\n';
                    } else {
                        result += item.slice(j * length, item.length);
                    }
                }
            } else {
                result += item;
            }
        }
        return result;
    }
    exports.WrapText = WrapText;
    function randomString() {
        var str;
        do {
            str = Math.random().toString().substr(2);
        } while (!/^\d{4}\d*$/.test(str));
        return str;
    }
    function NotificationCenter() {
        var _listeners = {};
        this.listen = function (type, listener) {
            var cb = _listeners[type];
            if (!cb) cb = _listeners[type] = [];
            cb.push(listener);
        };
        this.unlisten = function (type, listener) {
            var cb = _listeners[type];
            if (!cb) return;
            var index = cb.indexOf(listener);
            if (index < 0) return;
            cb.splice(index, 1);
            if (cb.length === 0) delete _listeners[type];
        };
        this.send = function (type) {
            var cb = _listeners[type];
            if (!cb) return;
            for (var i = 0; i < cb.length; i++) {
                cb[i].apply(null, arguments);
            }
        };
    }
    exports.notificationCenter = new NotificationCenter();
    //数据验证级别
    //数字:undefined,NaN,Infinity,2   U(GU),NAN(GNAN),I(GI),N
    //对象:undefined,null,{}  ...N(GN)
    //字串:undefined,'','xxx' ...S(GS)
    var DC;
    (function (DC) {
        //根据路径获取值,无法
        // 取值
        // var v=export function DC.V({a:"a",b:{c:[{d:"D1"},{d:true}]}},"b.c.1.d");
        // //>v=true
        // 遍历
        // var v=export function DC.V({a:"a",b:{c:[{d:"D1"},{d:true}]}},"b.c.1.d",function(v,p){
        //     console.log(v,p);
        // })
        // //v=true
        // 赋值
        // var a={}
        // var v=export function DC.V(a,"b.c.1.d",function(v,p,P){
        //     if(p.join(".")=="b.c.1.d"){
        //         P[P.length-1]['d']={e:"e1"};
        //     }else{
        //         if(''+Number(p[p.length-1])==p[p.length-1]){
        //             P[P.length-1]=[];
        //             P[P.length-2][p[p.length-2]]=P[P.length-1];
        //         }
        //         P[P.length-1][p[p.length-1]]={};
        //     }
        // })
        // //>a={b:{c:[{d:{e:"e1"}}]}}
        // //>v={e:"e1"}
        function V(obj, path, fun) {
            var pattern = /([^\.]+)[\.]?/ig,
                r,
                R = obj,
                p = [],
                P = []; // /([^\.\[]+)[\.\[]?/ig
            while (r = pattern.exec(path)) {
                p.push(r[1]);
                P.push(R);
                fun && fun(R[r[1]], p, P);
                R = P[P.length - 1][r[1]];
                if (path == p.join('.')) return R;
                if (typeof R == 'undefined') return undefined;
                if (R == null) return undefined;
            }
        }
        DC.V = V;
        //获取值
        function GV(a, path) {
            return V(a, path);
        }
        DC.GV = GV;
        //赋值
        // var a={}
        // var v=export function DC.SV(a,"b.c.1.d",{e:"e1"});
        // //>a={b:{c:[{d:{e:"e1"}}]}}
        // //>v={e:"e1"}
        // var v=export function DC.SV(a,"b.c.1.d",undefined);
        // var v=export function DC.SV(a,"b.c.1.d1",null);
        // var v=export function DC.SV(a,"b.c.1.d1",NaN);
        // var v=export function DC.SV(a,"b.c.1.d1","");
        // var v=export function DC.SV(a,"b.c.1.d1",false);
        function SV(a, path, value) {
            return V(a, path, function (v, p, P) {
                if (p.join(".") == path) {
                    P[P.length - 1][p[p.length - 1]] = value;
                } else {
                    if ('' + Number(p[p.length - 1]) == p[p.length - 1]) {
                        var t = [];
                        for (var i in P[P.length - 1]) {
                            t[i] = P[P.length - 1][i];
                        }
                        P[P.length - 1] = t;
                        P[P.length - 2][p[p.length - 2]] = P[P.length - 1];
                    }
                    if (typeof v == 'undefined' || v == null || (typeof v === "undefined" ? "undefined" : _typeof(v)) != "object") {
                        P[P.length - 1][p[p.length - 1]] = {};
                    }
                }
            });
        }
        DC.SV = SV;
        //全部非undefined,返回true,否则false
        //GU([data],'0.b','0.c','1')
        function GU(datas, list) {
            var list = arguments[1].split(',');
            var gn = function gn(R) {
                if (typeof R == 'undefined') return false;
                return true;
            };
            return list.every(function (v) {
                var pattern = /([^\.]+)[\.]?/ig,
                    r,
                    R = datas;
                while (r = pattern.exec(v)) {
                    if (r[1] == '*') {
                        for (var i in R) {
                            if (!gn(R[i])) return false;
                        }
                    } else {
                        R = R[r[1]];
                        if (!gn(R)) return false;
                    }
                }
                return true;
            });
        }
        DC.GU = GU;
        //全部非undefined非null,返回true,否则false
        function GN(datas, list) {
            var list = arguments[1].split(',');
            var gn = function gn(R) {
                if (typeof R == 'undefined') return false;
                if (R == null) return false;
                return true;
            };
            return list.every(function (v) {
                var pattern = /([^\.]+)[\.]?/ig,
                    r,
                    R = datas;
                while (r = pattern.exec(v)) {
                    if (r[1] == '*') {
                        for (var i in R) {
                            if (!gn(R[i])) return false;
                        }
                    } else {
                        R = R[r[1]];
                        if (!gn(R)) return false;
                    }
                }
                return true;
            });
        }
        DC.GN = GN;
    })(DC = exports.DC || (exports.DC = {}));
    function d(str) {
        for (var _len = arguments.length, arr = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            arr[_key - 1] = arguments[_key];
        }

        var argumentslist = arguments;
        var reg = /({[^{}]+})/g,
            x = null,
            l = [];
        while ((x = reg.exec(str)) != null) {
            l.push([x[1]]);
        }
        l.map(function (v) {
            var a = v[0].indexOf("{"),
                b = v[0].indexOf("??"),
                c = v[0].indexOf("?"),
                d = v[0].indexOf("}"),
                V;
            if (b == -1) {
                var c = v[0].substring(a + 1, c);
                var C = argumentslist[Number(c) + 1];
                V = C ? 'FBa' : 'FBb'; //todo
            } else {
                var c = v[0].substring(a + 1, c);
                var C = argumentslist[Number(c) + 1];
                V = C ? 'FAa' : 'FAb';
            }
            str = str.replace(v[0], V);
        });
        return str;
    }
    var t = d('历史不会{0?我:你}重演{0?我:你}依次是:{1??1,:1}', {}, {});
    //根据类型列表判断
    function typeTest(datas, list) {}
    typeTest([], '');
    function getUrlParameter(name) {
        var hash = decodeURIComponent(window.location.hash);
        var reg = new RegExp("[\?|^|&]" + name + "=([^&]*)", "i");
        var r = hash.match(reg);
        if (r != null) return r[1];
        return null;
    }
    exports.getUrlParameter = getUrlParameter;
    function lon3857(lon) {
        if (isFinite(lon)) {
            var size = 262144 * 0.5971642833948135 * 256;
            return ((lon + 180) % 360 + 360) % 360 / 360 * size - size / 2;
        } else {
            return NaN;
        }
    }
    exports.lon3857 = lon3857;
    function lat3857(lat) {
        if (isFinite(lat) && lat < 85 && lat > -85) {
            var size = 262144 * 0.5971642833948135 * 256;
            var sinLatitude = Math.sin(lat * Math.PI / 180);
            return (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * size - size / 2;
        } else {
            return NaN;
        }
    }
    exports.lat3857 = lat3857;

    var rect = function () {
        function rect() {
            _classCallCheck(this, rect);
        }

        _createClass(rect, null, [{
            key: "contains",
            value: function contains(rect, x, y) {
                return x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height;
            }
        }, {
            key: "create",
            value: function create(x, y, width, height) {
                return {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };
            }
        }]);

        return rect;
    }();

    exports.rect = rect;

    var position = function () {
        function position() {
            _classCallCheck(this, position);
        }

        _createClass(position, null, [{
            key: "create",
            value: function create(x, y) {
                return {
                    x: x,
                    y: y
                };
            }
        }]);

        return position;
    }();

    exports.position = position;

    var sprite = function () {
        function sprite() {
            _classCallCheck(this, sprite);
        }

        _createClass(sprite, null, [{
            key: "create",
            value: function create(image, frame) {
                return {
                    image: image,
                    frame: frame
                };
            }
        }, {
            key: "get",
            value: function get(name) {
                return this.cache_[name] || null;
            }
        }, {
            key: "set",
            value: function set(name, sprite) {
                this.cache_[name] = sprite;
            }
        }, {
            key: "item",
            value: function item(name) {
                return this.get(name);
            }
        }]);

        return sprite;
    }();

    sprite.cache_ = {};
    exports.sprite = sprite;
});