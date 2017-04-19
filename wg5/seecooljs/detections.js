var detections =(function () {
    var detects = {
        canvas: function (win) {
            var c = win['CanvasRenderingContext2D'];
            if (!c) return false;
            return typeof(c.prototype['fillText']) === 'function';
        },
        typedArray: function (win) {
            return !!win.Int8Array;
        },
        xhr: function (win) {
            return !!win.XMLHttpRequest;
        },
        xhrCors: function (win) {
            return ('withCredentials' in new win.XMLHttpRequest());
        },
        svg: function (win) {
            doc = win.document;
            if (!doc.createElementNS)
                return false;
            var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
            return !!(svg['createSVGRect']);
        },
        cssBeforeAfter: function (win) {
            doc = win.document;
            var css = '#generatedcontenttester{font: 0/0 a}' +
                '#generatedcontenttester:after { content: ":)"; font: 9px/1 a}';
            /**
             * @type {HTMLElement}
             */
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
    };

    return function (win) {
        return detects.canvas(win)
            && detects.cssBeforeAfter(win)
            && detects.svg(win)
            && detects.typedArray(win)
            && detects.xhr(win)
            && detects.xhrCors(win)
            && true;
    };
})();
