import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Loading, Platform } from 'ionic-angular';

import { VesselGroupService } from '../service/vessel-group.service';
import { VesselGroup } from '../data/vessel-group';
import { VesselGroupMemberPage } from './vessel-group-member.page';

@Component({
    templateUrl: './vessel-group.page.html'
})
export class VesselGroupPage implements OnInit {
    Groups: VesselGroup[] = [];
    private _loading: Loading;
    constructor(private _vesselGroupService: VesselGroupService, private _navCtrl: NavController, private _loadingCtrl: LoadingController, private _platform: Platform) {
        this._vesselGroupService.DataManager.Snapshot.subscribe(p => {
            this.Groups = p;
        });
    }

    ngOnInit() {
        this.startLoading();
        this._vesselGroupService.RefreshData().then(p => {
            this.Groups = this._vesselGroupService.DataManager.DataSource();
            this.stopLoading();
        }).catch(errMsg => {
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
    GotoMembers(group: VesselGroup) {
        console.log(group.Name);
        this._navCtrl.push(VesselGroupMemberPage, group);
    }
    Refresh(refresher) {
        this._vesselGroupService.RefreshData().then(p => {
            this.Groups = this._vesselGroupService.DataManager.DataSource();
            refresher.complete();
        }).catch(errMsg => {
            console.log(errMsg);
            refresher.complete();
        });
    }
    get IsNotIOS() {
        return !this._platform.is('ios');
    }
}