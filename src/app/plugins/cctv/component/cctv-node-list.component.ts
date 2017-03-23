import { Component, Input } from '@angular/core';

import { CCTVDataService } from '../service/cctv-data.service';
declare var seecool: { cctv: { play: (ip, port, token) => void } };

@Component({
    selector: "cctv-list",
    templateUrl: './cctv-node-list.component.html'
})
export class CCTVNodeListComponent {
    private _itemSource: any[];
    @Input()
    set itemSource(value) {
        this._itemSource = value;

        this.clearArray(this.serverNodes);
        this.clearArray(this.frontNodes);
        this.clearArray(this.videoNodes);

        this._itemSource.forEach(item => {
            if (item.type === 1)
                this.serverNodes.push(item);
            if (item.type === 2) {
                this.videoNodes.push(item);
            }
        })
    };

    serverNodes: any[] = [];
    frontNodes: any[] = [];
    videoNodes: any[] = [];

    constructor(private _cctvData: CCTVDataService) {

    }

    openVideo(video) {
        this._cctvData.getPlayParam(video.elementId).then(playParam => {
            seecool.cctv.play(playParam.Ip, playParam.Port, playParam.Token);
        })
    }

    private clearArray(array: any[]) {
        if (array === undefined || array === null)
            array = [];
        array.splice(0, array.length);
    }
}