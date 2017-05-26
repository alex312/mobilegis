import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CCTVDataService } from '../service/cctv-data.service';

declare var seecool: { cctv: { play: (ip, port, token) => void } };

@Component({
    selector: "cctv-list-page",
    templateUrl: './cctv.component.html'
})
export class CCTVComponent {
    nodePathList: any[] = [];

    serverNodes: any[] = [];
    frontNodes: any[] = [];
    videoNodes: any[] = [];

    constructor(private _dataService: CCTVDataService,
        private _navCtrl: NavController) {
        this._dataService.refresh().then(() => {
            this.resetList();
        });
    }

    openVideo(video) {
        if (seecool === undefined || seecool === null ||
            seecool.cctv === undefined || seecool.cctv === null ||
            seecool.cctv.play === undefined || seecool.cctv.play === null)
            return;
        this._dataService.getPlayParam(video.elementId).then(playParam => {
            seecool.cctv.play(playParam.Ip, playParam.Port, playParam.Token);
        })
    }

    viewChild(node) {
        this.nodePathList.push({
            name: node.name,
            nodeId: node.id
        })
        this.resetList(node.id);
    }

    viewNodeInPath(index: number) {
        this.nodePathList.splice(index + 1);
        this.resetList(this.nodePathList[index].nodeId);
    }

    resetViewNodePath() {
        this.nodePathList.splice(0, this.nodePathList.length);
        this.resetList();
    }

    private resetList(id: string = null) {
        this.clearArray(this.serverNodes);
        this.clearArray(this.frontNodes);
        this.clearArray(this.videoNodes);

        this._dataService.getTree(id).nodes.forEach(item => {
            if (item.type === 1) {
                this.serverNodes.push(item);
            }
            if (item.type === 2) {
                this.videoNodes.push(item);
            }
            if (item.type === 3) {
                this.frontNodes.push(item);
            }
        })
    }

    private clearArray(array: any[]) {
        if (array === undefined || array === null)
            array = [];
        array.splice(0, array.length);
    }
}