import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { DataManager } from '../../../base';

import { TaskManageService } from '../service/task-manage.service';
import { ExecuteRecordService } from '../service/execute-record.service';
import { ExecuteUnitService } from '../service/execute-unit.service';

import { RecordListPage } from './record-list.page'
import { TaskUnionModelContentPage } from './task-unit-edit-modal.page';
import { TaskDetailPage } from './task-detail.page';

import { Task } from '../data/task';
import { TaskStatus } from '../data/metadata';

import { UserLoginPage } from '../../user';

@Component({
    selector: "task-list-page",
    templateUrl: './task-list.page.html',
})
export class TaskListPage {

    pendingReceiveTasks: DataManager<Task>;
    pendingExecutionTasks: DataManager<Task>;
    beingExecutedTasks: DataManager<Task>;
    completedTasks: DataManager<Task>;
    status = TaskStatus.PendingReceive;

    TaskStatus = TaskStatus;
    constructor(private nav: NavController,
        private modalCtrl: ModalController,
        private taskManager: TaskManageService,
        private executeUnitService: ExecuteUnitService,
        private executionRecordService: ExecuteRecordService) {

        this.pendingReceiveTasks = this.taskManager.getDataManager(TaskStatus.PendingReceive);
        this.pendingExecutionTasks = this.taskManager.getDataManager(TaskStatus.PendingExecution);
        this.beingExecutedTasks = this.taskManager.getDataManager(TaskStatus.BeginExecuted);
        this.completedTasks = this.taskManager.getDataManager(TaskStatus.Completed);
    }

    // 以下与task业务流程操作相关
    showRecords(task) {
        this.nav.push(RecordListPage, task);
    }

    nextStatus(task: Task) {
        this.taskManager.nextStatus(task);
    }

    execute(task: Task) {
        this.executeUnitService.getExecutUnit(task.Id)
            .then(function (data) {
                let modal = this.modalCtrl.create(TaskUnionModelContentPage, { taskId: task.Id, unit: data });
                modal.onDismiss(data => {
                    if (data) {
                        task.Members = data.members;
                        task.Vehicles = data.vehicles;
                        task.Equipments = data.equipments;
                        this.nextStatus(task);
                    }
                });
                modal.present(modal);
            }.bind(this));
    }

    gotoDetail(task: Task) {
        this.taskManager.refreshTask(task.Id).then((data) => {
            this.nav.push(TaskDetailPage, { task: task });
        })

    }

    doRefresh(refresher) {
        this.taskManager.refreshData(this.status).
            then(function () {
                refresher.complete();
            });
    }

    segmentChanged(event) {
        this.taskManager.refreshData(this.status).then(() => {
            let taskIds = [];
            if (this.status === TaskStatus.BeginExecuted)
                this.beingExecutedTasks.Items.forEach((task) => {
                    taskIds.push(task.Id);
                })
            if (this.status === TaskStatus.Completed)
                this.completedTasks.Items.forEach((task) => {
                    taskIds.push(task.Id);
                })
            this.executionRecordService.refreshRecords(taskIds);
        });
    }

    goBack() {
        this.nav.pop();
    }

    logout() {
        this.nav.setRoot(UserLoginPage).then((result) => {
            this.nav.popToRoot()
        });
    }
}