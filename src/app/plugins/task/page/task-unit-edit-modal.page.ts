import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { MembersService } from '../service/members.service';
import { EquipmentsService } from '../service/equipments.service';
import { VehiclesService } from '../service/vehicles.service';
import { ExecuteUnitService } from '../service/execute-unit.service';

@Component({
    selector: "task-unit-edit",
    templateUrl: './task-unit-edit-modal.page.html',
})
export class TaskUnionModelContentPage {
    allEquipments;
    allVehicles;
    allMembers;

    taskId;
    members;
    vehicles;
    equipments;

    constructor(private platform: Platform,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private membersService: MembersService,
        private equipmentsService: EquipmentsService,
        private vehiclesService: VehiclesService,
        private executeUnitService: ExecuteUnitService) {

        this.allMembers = membersService.DataManager;
        this.allEquipments = equipmentsService.DataManager;
        this.allVehicles = vehiclesService.DataManager;

        this.taskId = this.navParams.data.taskId;
        this.members = this.navParams.data.unit.members;
        this.vehicles = this.navParams.data.unit.vehicles;
        this.equipments = this.navParams.data.unit.equipments;
    }

    selectMemberChanged(members) {
        this.members = members;
    }
    selectVehicleChanged(vehicles) {
        this.vehicles = vehicles;
    }
    selectEquipmentChanged(equipments) {
        this.equipments = equipments.map((item) => {
            if (item)
                return item;
        })
    }

    hasChecked(data, collections) {
        if (!collections)
            return false;
        for (let item of collections) {
            if (item.Id === data.Id)
                return true;
        }
        return false;
    }

    hasCheckedMembers(members, collections) {
        if (!collections)
            return false;
        for (let item of collections) {
            if (item.UserId == members.UserId)
                return true;
        }
        return false;
    }

    cancel() {

        this.viewCtrl.dismiss();
    }

    ok() {
        let unit = {
            members: this.members && this.members.map(t => t.UserId),
            vehicles: this.vehicles && this.vehicles.map(t => t.Id),
            equipments: this.equipments && this.equipments.map(t => t.Id)
        };
        this.executeUnitService.saveUnit(
            this.taskId,
            unit
        ).then(data => {
            this.viewCtrl.dismiss({
                Members: this.members,
                Vehicles: this.vehicles,
                Equipments: this.equipments
            });
        }).catch(function () {
            console.log("更新失败");
        });

    }
}