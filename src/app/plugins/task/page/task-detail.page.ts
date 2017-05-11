import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Format } from '../../../base';

import { TaskManageService } from '../service/task-manage.service';

import { TaskUnionModelContentPage } from './task-unit-edit-modal.page';

import { Task } from '../data/task';


@Component({
    selector: "task-detail-page",
    templateUrl: './task-detail.page.html',
})
export class TaskDetailPage implements OnInit {
    task: Task;
    members;
    vehicles;
    equipments;
    Format = Format;
    constructor(private nav: NavController,
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private taskManager: TaskManageService) {

    }

    ngOnInit() {
        this.task = this.navParams.get("task");
        this.reset();
    }
    goBack() {
        this.nav.pop();
    }

    reset() {
        this.members = this.task.Members && this.task.Members.map(member => member.UserName).join('，');
        this.vehicles = this.task.Vehicles && this.task.Vehicles.map(vehicles => vehicles.Name).join('，');
        this.equipments = this.task.Equipments && this.task.Equipments.map(equipment => equipment.Name).join('，');
    }

    editTaskUnit() {
        let paramData = {
            taskId: this.task.Id,
            unit: {
                members: this.task.Members,
                vehicles: this.task.Vehicles,
                equipments: this.task.Equipments
            }
        }
        let modal = this.modalCtrl.create(TaskUnionModelContentPage, paramData);
        modal.onDidDismiss(confirmed => {
            if (confirmed) {
                this.task.Members = confirmed.Members;
                this.task.Vehicles = confirmed.Vehicles;
                this.task.Equipments = confirmed.Equipments;
                this.reset();
            }
        });
        modal.present(modal);
    }
}