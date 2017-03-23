"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var config_1 = require('../../config');
require('rxjs/add/operator/toPromise');
var ApiClientService = (function () {
    function ApiClientService(http) {
        this.http = http;
    }
    ApiClientService.prototype.get = function (url, options) {
        url = this.proxy(url);
        options = this.mergeOption(options);
        return this.http.get(url, options)
            .toPromise()
            .then(this.toJson)
            .catch(this.handleError);
    };
    ApiClientService.prototype.post = function (url, body, options) {
        url = this.proxy(url);
        options = this.mergeOption(options);
        return this.http.post(url, JSON.stringify(body), options)
            .toPromise()
            .then(this.toJson)
            .catch(this.handleError.bind(this));
    };
    ApiClientService.prototype.put = function (url, body, options) {
        url = this.proxy(url);
        options = this.mergeOption(options);
        return this.http.put(url, body && JSON.stringify(body), options)
            .toPromise()
            .then(function () { return body; })
            .catch(this.handleError.bind(this));
    };
    ApiClientService.prototype.delete = function (url, options) {
        url = this.proxy(url);
        options = this.mergeOption(options);
        return this.http.delete(url, options)
            .toPromise()
            .catch(this.handleError.bind(this));
    };
    ApiClientService.prototype.mergeOption = function (options) {
        if (!options)
            options = {};
        if (!options.headers)
            options.headers = new http_1.Headers({
                'Content-Type': 'application/json'
            });
        return options;
    };
    ApiClientService.prototype.proxy = function (url) {
        var useProxy = config_1.Config.CORDOVA_READY;
        if (useProxy) {
            var isAbsoluteUrl = url.search('(http|https)://') === 0;
            if (isAbsoluteUrl) {
                var urlParts = url.split('/').splice(3);
                url = (urlParts || ['']).join('/');
                url = url.replace('$/', '');
            }
            url = config_1.Config.proxy.concat(url);
        }
        return url;
    };
    ApiClientService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    ApiClientService.prototype.toJson = function (response) {
        var jsonResult = response.json();
        return jsonResult;
    };
    ApiClientService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ApiClientService);
    return ApiClientService;
}());
exports.ApiClientService = ApiClientService;
