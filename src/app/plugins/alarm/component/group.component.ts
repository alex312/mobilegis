import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Alarm } from '../data/alarm';
import { MapPage } from '../../map';
import { Group } from '../data/group';

@Component({
    selector: 'alarm-group',
    templateUrl: './group.component.html'
})
export class GroupComponent implements OnInit {
    @Input()
    Group: Group;
    IconName: string = 'arrow-down';
    constructor(private _nav: NavController) {
    }
    ngOnInit() {
        this.changeIcon(this.Group.Hidden);
    }
    HideGroup(group) {
        group.hidden = !group.hidden;
        this.changeIcon(group.hidden);
    }
    LocateShip(alarm: Alarm) {
        console.log(alarm.TrackId);
        this._nav.push(MapPage, { type: "shipLayer", selectedUid: alarm.TrackId });
    }
    private changeIcon(hidden: boolean) {
        this.IconName = hidden ? 'arrow-dropdown' : 'arrow-dropup';
    }
}