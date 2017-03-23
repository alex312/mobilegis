import { Component, OnInit, Input } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { ApiClientService } from '../../../base';
import { Config } from '../../../config';

@Component({
    selector: 'ship-archive',
    templateUrl: './ship-archive.component.html',
})
export class ShipArchiveComponent implements OnInit {
    @Input()
    shipId: string;
    archive;
    loading: Loading;
    constructor(private nav: NavController,
        private loadingCtrl: LoadingController,
        private apiClient: ApiClientService) {

    }
    ngOnInit() {
        this.startLoading()
        this.query()
            .then(this.stopLoading.bind(this))
            .catch(this.stopLoading.bind(this));
    }

    query() {
        // let linkPromise = this.apiClient.get(`wg5/LinkService/api/link?signalIds=SCUNION..${this.shipId}`);
        let linkPromise = this.apiClient.get(`${Config.Plugins.Ship.LinkUrl}?signalIds=SCUNION..${this.shipId}`);

        //archiveId
        linkPromise.then(link => {
            //TODO: 使用link对象
            let archiveId = link[0]["archiveId"];
            // let promise = this.apiClient.get(`wg5/ShipArchiveWebService/api/ShipArchive/shipId=${archiveId}`);
            let promise = this.apiClient.get(`${Config.Plugins.Ship.ArchiveUrl}/shipId=${archiveId}`);
            promise.then(archive => {
                this.archive = archive
            });
            //TODO：promise 的catch处理
        });

        // TODO：linkPromise的catch处理
        return linkPromise;
    }

    startLoading() {
        this.loading = this.loadingCtrl.create({
            content: "请稍后...",
            // 如果在ngOnInit中显示loading，需要设置为false，否则ngOnInit执行完之后将dismiss loading。
            dismissOnPageChange: false
        });
        this.loading.present(this.loading);
    }

    stopLoading() {

        this.loading.dismiss();
    }
}