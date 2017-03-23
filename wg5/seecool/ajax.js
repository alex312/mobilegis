"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var AjaxPromiseAbortFunction = Symbol();

    var ajax = function () {
        function ajax() {
            _classCallCheck(this, ajax);
        }

        _createClass(ajax, null, [{
            key: "request",
            value: function request(options) {
                var resolve,
                    reject,
                    done = false;
                var promise = new Promise(function (s, j) {
                    var _ref;

                    return _ref = [s, j], resolve = _ref[0], reject = _ref[1], _ref;
                });
                var xhr = new XMLHttpRequest();
                var url = options.url;
                var params = serializeObject(options.params);
                if (params) url += '?' + params;
                xhr.open(options.method, url, true);
                var keys = [];
                setHeaders(xhr, options.headers, keys);
                setHeaders(xhr, this.defaultHeaders_, keys);
                if (keys.indexOf('Authentication'.toLowerCase()) < 0) {
                    var token = localStorage.getItem('sc.auth');
                    if (token) xhr.setRequestHeader('Authentication', token);
                }
                if (options.data && keys.indexOf('Content-Type'.toLowerCase()) < 0) xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function () {
                    if (!done) {
                        done = true;
                        var data,
                            ct = (xhr.getResponseHeader('Content-Type') || '').replace(/;.*$/, '').trim();
                        if (xhr.status === 204) {
                            data = void 0;
                        } else if (ct === "application/json" || ct === "text/json") {
                            data = JSON.parse(xhr.responseText);
                        } else if (/^text\//.test(ct)) {
                            data = xhr.responseText;
                        } else {
                            data = xhr.response;
                        }
                        if (xhr.status >= 200 && xhr.status < 300) resolve(data);else if (xhr.status === 0 && xhr.readyState === 4 && xhr.responseText) resolve(xhr.responseText); // For a local file request on iOS(maybe others, too)
                        else {
                                var error = new RestError(xhr, data);
                                if (ajax.onRestErrorCallback) ajax.onRestErrorCallback(error);
                                reject(error);
                            }
                    }
                };
                xhr.onerror = function () {
                    if (!done) {
                        done = true;
                        reject(new HttpUnknownError(xhr));
                    }
                };
                options.data ? xhr.send(JSON.stringify(options.data)) : xhr.send();
                promise[AjaxPromiseAbortFunction] = function (throwError) {
                    if (!done) {
                        done = true;
                        if (throwError) reject(new HttpAbortError(xhr));
                        return true;
                    }
                    return false;
                };
                var timeout = options.timeout || this.defaultTimeout_;
                if (timeout) {
                    setTimeout(function () {
                        if (!done) {
                            done = true;
                            reject(new HttpTimeoutError(xhr));
                        }
                    }, timeout * 1000);
                }
                return promise;
            }
        }, {
            key: "abort",
            value: function abort(promise, throwError) {
                if (AjaxPromiseAbortFunction in promise) promise[AjaxPromiseAbortFunction](throwError);
            }
        }, {
            key: "get",
            value: function get(url, params, headers) {
                return this.request({ method: 'GET', url: url, params: params, headers: headers });
            }
        }, {
            key: "post",
            value: function post(url, data, headers) {
                return this.request({ method: 'POST', url: url, data: data, headers: headers });
            }
        }, {
            key: "put",
            value: function put(url, data, headers) {
                return this.request({ method: 'PUT', url: url, data: data, headers: headers });
            }
        }, {
            key: "del",
            value: function del(url, params, headers) {
                return this.request({ method: 'DELETE', url: url, params: params, headers: headers });
            }
        }, {
            key: "defaultTimeout",
            get: function get() {
                return this.defaultTimeout_;
            },
            set: function set(value) {
                this.defaultTimeout_ = value;
            }
        }, {
            key: "defaultHeaders",
            get: function get() {
                return this.defaultHeaders_;
            }
        }]);

        return ajax;
    }();

    ajax.defaultTimeout_ = NaN;
    ajax.defaultHeaders_ = {};
    ajax.onRestErrorCallback = null;
    ajax.HttpError = HttpError;
    ajax.HttpTimeoutError = HttpTimeoutError;
    ajax.HttpUnknownError = HttpUnknownError;
    ajax.HttpAbortError = HttpAbortError;
    ajax.RestError = RestError;
    exports.ajax = ajax;
    function setHeaders(xhr, headers, keys) {
        if (!headers) return;
        for (var each in headers) {
            if (headers.hasOwnProperty(each)) {
                var key = each.toLowerCase();
                if (keys.indexOf(key) < 0) {
                    xhr.setRequestHeader(each, headers[each]);
                    keys.push(key);
                }
            }
        }
    }
    function serializeObject(obj, parents) {
        if (typeof obj === 'string') return obj;
        var resultArray = [];
        var separator = '&';
        parents = parents || [];
        var newParents;
        function var_name(name) {
            if (parents.length > 0) {
                var _parents = '';
                for (var j = 0; j < parents.length; j++) {
                    if (j === 0) _parents += parents[j];else _parents += '[' + encodeURIComponent(parents[j]) + ']';
                }
                return _parents + '[' + encodeURIComponent(name) + ']';
            } else {
                return encodeURIComponent(name);
            }
        }
        function var_value(value) {
            return encodeURIComponent(value);
        }
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var toPush;
                if (Array.isArray(obj[prop])) {
                    toPush = [];
                    for (var i = 0; i < obj[prop].length; i++) {
                        if (!$.isArray(obj[prop][i]) && _typeof(obj[prop][i]) === 'object') {
                            newParents = parents.slice();
                            newParents.push(prop);
                            newParents.push(i + '');
                            toPush.push(serializeObject(obj[prop][i], newParents));
                        } else {
                            toPush.push(var_name(prop) + '[]=' + var_value(obj[prop][i]));
                        }
                    }
                    if (toPush.length > 0) resultArray.push(toPush.join(separator));
                } else if (_typeof(obj[prop]) === 'object') {
                    // Object, convert to named array
                    newParents = parents.slice();
                    newParents.push(prop);
                    toPush = serializeObject(obj[prop], newParents);
                    if (toPush !== '') resultArray.push(toPush);
                } else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                    // Should be string or plain value
                    resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
                }
            }
        }
        return resultArray.join(separator);
    }
    function HttpError() {}
    exports.HttpError = HttpError;
    HttpError.prototype = new Error();
    function HttpTimeoutError(xhr) {
        this.name = 'HttpTimeoutError';
        this.message = "Timeout";
        this.stack = new Error()['stack'];
        this.httpCode = 0;
        this.xhr = xhr;
        this.data = null;
    }
    exports.HttpTimeoutError = HttpTimeoutError;
    HttpTimeoutError.prototype = new HttpError();
    function HttpUnknownError(xhr) {
        this.name = 'HttpUnknownError';
        this.message = "Unknown";
        this.stack = new Error()['stack'];
        this.httpCode = 0;
        this.xhr = xhr;
        this.data = null;
    }
    exports.HttpUnknownError = HttpUnknownError;
    HttpUnknownError.prototype = new HttpError();
    function HttpAbortError(xhr) {
        this.name = 'HttpAbortError';
        this.message = "Aborted";
        this.stack = new Error()['stack'];
        this.httpCode = 0;
        this.xhr = xhr;
        this.data = null;
    }
    exports.HttpAbortError = HttpAbortError;
    HttpAbortError.prototype = new HttpError();
    function RestError(xhr, data) {
        this.name = 'RestError';
        this.message = xhr.statusText;
        this.stack = new Error()['stack'];
        this.httpCode = xhr.status;
        this.xhr = xhr;
        this.data = data;
    }
    exports.RestError = RestError;
    RestError.prototype = new HttpError();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ajax;
});