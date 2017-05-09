import { Component } from '@angular/core'
import { NavController, NavParams, ModalController } from 'ionic-angular'

import * as moment from 'moment';

import { UserService, User } from '../../user';

import { Task } from '../data/task';

import { ExecuteRecordService } from '../../task/service/execute-record.service';
import { AttachmentService } from '../../task/service/attachment.service';
import { ExecutionRecordModelContentPage } from './execution-record-modal.page';


@Component({
    selector: "record-list-page",
    templateUrl: './record-list.page.html'
})
export class RecordListPage {
    task: Task

    constructor(private nav: NavController,
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private recordManager: ExecuteRecordService,
        private attachmentService: AttachmentService,
        private userService: UserService) {
        this.task = this.navParams.data;
        // this.records = recordManager.getRecords(this.task.Id);
    }

    get records() {
        if (!this.task)
            return [];
        return this.recordManager.getRecords(this.task.Id);
    }

    showAttachments(record) {
        //TODO
    }

    showNotes(record) {
        //TODO
    }

    addNew() {
        this.nav.push(ExecutionRecordModelContentPage, { taskId: this.task.Id });
        // let modal = this.modalCtrl.create(ExecutionRecordModelContentPage, );

        // modal.onDidDismiss(data => {
        //     if (data) {
        //         this.recordManager.update(data)
        //     }
        // });
        // modal.present(modal);
    }

    editRecord(selectedRecord) {
        // let modal = this.modalCtrl.create(ExecutionRecordModelContentPage, { record: selectedRecord });
        // modal.onDidDismiss(data => {
        //     if (data) {
        //         this.recordManager.update(data)
        //     }
        // });
        // modal.present(modal);
        this.nav.push(ExecutionRecordModelContentPage, { record: selectedRecord });
    }

    goBack() {
        this.nav.pop();
    }

    dataFormat(date: Date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    getPersonName(persionId: number) {
        let persion = new User();
        persion.UserId = persionId;
        persion = this.userService.Users.find(persion, (left, right) => left.UserId === right.UserId);
        return persion && persion.UserName;
    }
}
