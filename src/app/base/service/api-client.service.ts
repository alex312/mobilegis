import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Config } from '../../config';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiClientService {
    constructor(private http: Http) {

    }

    get(url: string, options?: RequestOptionsArgs) {
        url = this.proxy(url);

        options = this.mergeOption(options);

        return this.http.get(url, options)
            .toPromise()
            .then(this.toJson)
            .catch(this.handleError);
    }




    post(url: string, body: any, options?: RequestOptionsArgs) {
        url = this.proxy(url);

        options = this.mergeOption(options);

        return this.http.post(url, JSON.stringify(body), options)
            .toPromise()
            .then(this.toJson)
            .catch(this.handleError.bind(this));
    }

    put(url: string, body?: any, options?: RequestOptionsArgs) {
        url = this.proxy(url);

        options = this.mergeOption(options);

        return this.http.put(url, body && JSON.stringify(body), options)
            .toPromise()
            .then(() => body)
            .catch(this.handleError.bind(this));
    }

    delete(url: string, options?: RequestOptionsArgs) {
        url = this.proxy(url);

        options = this.mergeOption(options);

        return this.http.delete(url, options)
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    private mergeOption(options?: RequestOptionsArgs) {
        if (!options)
            options = {};

        if (!options.headers)
            options.headers = new Headers({
                'Content-Type': 'application/json'
            })
        return options;
    }

    private proxy(url: string) {
        let useProxy = Config.CORDOVA_READY;
        if (useProxy) {
            let isAbsoluteUrl = url.search('(http|https)://') === 0
            if (isAbsoluteUrl) {
                let urlParts = url.split('/').splice(3);
                url = (urlParts || ['']).join('/');
                url = url.replace('$/', '');
            }
            url = Config.proxy.concat(url);
        }
        return url;
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private toJson(response: Response) {
        var jsonResult = response.json();
        return jsonResult;
    }
}