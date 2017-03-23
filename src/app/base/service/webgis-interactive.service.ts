import {Injectable} from '@angular/core';

@Injectable()
export class WebGISInteractiveService {
    callbackHandlers: { [key: string]: ((a: any) => void) } = {};
    // TODO：该文件放在plugin/map/service中时，shipsummarycomponent会提示构造函数找不到参数，放在base/service中没有问题。可能是gulp打包问题。
    constructor() {
        if (!window['invokeCallback']) {
            window['invokeCallback'] = this.onCallback.bind(this);
        }
    }

    callWebGISAction(actionName: string, ...data: any[]) {
        let webgisInterface = this.getWebGISInterface();
        webgisInterface && webgisInterface[actionName] && webgisInterface[actionName](...data);
    }
    callWebGISAction2(actionName1: string, actionName2: string, ...data: any[]) {
        let webgisInterface = this.getWebGISInterface();
        webgisInterface && webgisInterface[actionName1] && webgisInterface[actionName1][actionName2] && webgisInterface[actionName1][actionName2](...data);
    }
    getWebGISInterface() {
        return window['webgis5'];
    }

    registCallback(name: string, callback: ((a: any) => void)) {
        this.callbackHandlers[name] = callback;
    }

    unregistCallback(name: string, callback: ((a: any) => void)) {
        // let callbackIndex = this.callbackHandlers[name].indexOf(callback);
        delete this.callbackHandlers[name]
    }

    onCallback(e) {
        let name = e.Fun;
        let callback = this.callbackHandlers[name];
        if (callback)
            callback(e.Data);
    }
}