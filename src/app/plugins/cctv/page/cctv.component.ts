import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CCTVDataService } from '../service/cctv-data.service';


@Component({
    templateUrl: './cctv.component.html'
})
export class CCTVComponent {
    _cctvNodes = [];
    constructor(private _dataService: CCTVDataService,
        private _navCtrl: NavController) {



        this._dataService.getTree().then(cctvTree => {
            this._cctvNodes = cctvTree.nodes;
        });
    }
}