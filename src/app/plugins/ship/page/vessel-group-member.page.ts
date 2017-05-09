import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { VesselGroup } from '../data/vessel-group';
import { VesselGroupService } from '../service/vessel-group.service';
import { VesselGroupMember } from '../data/vessel-group-member';
import { MapPage } from '../../map';

@Component({
    templateUrl: './vessel-group-member.page.html'
})
export class VesselGroupMemberPage implements OnInit {
    Group: VesselGroup;
    constructor(private _navCtrl: NavController, private _navParams: NavParams, private _vesselGroupService: VesselGroupService) {
        this.Group = this._navParams.data;
    }

    ngOnInit() { }

    Refresh(refresher) {
        this._vesselGroupService.RefreshData().then(p => {
            this.Group = this._vesselGroupService.DataManager.GetOrDefault(this.Group.Id.toString());
            refresher.complete();
        }).catch(errMsg => {
            console.log(errMsg);
            refresher.complete();
        });
    }
    LocateShip(member: VesselGroupMember) {
        let uid = `MMSI:${member.MMSI}`;
        console.log(uid);
        this._navCtrl.push(MapPage, { type: "shipLayer", selectedUid: uid });
    }
}