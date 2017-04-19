define(["require", "exports"], function (require, exports) {
    "use strict";
    function canvas() {
        var c = window['CanvasRenderingContext2D'];
        if (!c)
            return false;
        return typeof (c.prototype['fillText']) === 'function';
    }
    function svg() {
        var doc = window.document;
        if (!doc.createElementNS)
            return false;
        var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
        return !!(svg['createSVGRect']);
    }
    function cssBeforeAfter() {
        var doc = window.document;
        var css = '#generatedcontenttester{font: 0/0 a}' +
            '#generatedcontenttester:after { content: ":)"; font: 9px/1 a}';
        var o = doc.createElement('style');
        if (o['styleSheet'])
            o['styleSheet']['cssText'] = css;
        else
            o.appendChild(doc.createTextNode(css));
        doc.head.appendChild(o);
        var d = doc.createElement('div');
        d.id = 'generatedcontenttester';
        d.style.position = 'absolute';
        d.style.top = '-100px';
        doc.body.appendChild(d);
        var result = d.offsetHeight >= 9;
        doc.body.removeChild(d);
        return result;
    }
    var ok = canvas()
        && cssBeforeAfter()
        && svg()
        && window["Int8Array"]
        && window["XMLHttpRequest"]
        && ('withCredentials' in new window["XMLHttpRequest"])
        && document.body.classList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ok;
});
