import { Component, OnInit, Input } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';

import { NearbyShip } from '../data/nearby-ship';
import { NearbyShipService } from '../service/nearby-ship.service';
import { ShipSummary } from '../data/ship-summary';
import { MapHolderImp } from '../../map';

@Component({
    selector: 'nearby-ship',
    templateUrl: './nearby-ship.component.html',
    providers: [NearbyShipService]
})
export class NearbyShipComponent implements OnInit {
    @Input() Ship: ShipSummary;
    private _loading: Loading;
    Ships: NearbyShip[] = [];
    private _mapHolder = null;
    constructor(private _navCtrl: NavController, private _nearbyShipService: NearbyShipService, private _loadingCtrl: LoadingController) { }

    ngOnInit() {
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this._mapHolder = holder;
        });

        this.startLoading();
        this._nearbyShipService.GetShips(this.Ship.featureData.lon, this.Ship.featureData.lat).then(p => {
            this.Ships = p;
            this.stopLoading();
        }).then(errMsg => {
            console.log(errMsg);
            this.stopLoading();
        });
    }
    private startLoading() {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    }
    private stopLoading() {
        this._loading.dismiss();
    }
    LocateShip(ship: NearbyShip) {
        console.log(ship.ID);
        let fun = this._mapHolder.tool['shipLayer'];
        if (fun) {
            fun.SetFocus(ship.ID);
            this._navCtrl.pop();
        }
    }
}