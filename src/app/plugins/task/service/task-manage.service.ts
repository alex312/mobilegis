import { Injectable, Inject } from '@angular/core';

import { ApiClientService, EnumUtil } from '../../../base';

import { UserService } from '../../user/service/user.service';
import { LocationTracker } from '../../location';

import { TaskStatus } from '../data/metadata';
import { TaskWorkflowManagerService } from './task-workflow-manager.service'
import { TaskDataManagerCollection } from './task-data-manager-collection.service';
import { TaskConverter } from './converters/task-converter.service';
import { TASK_CONFIG, TaskConfig } from '../config';

import { Task } from '../data/task';
import { Note } from '../data/note';
import { Member } from '../data/member';

@Injectable()
export class TaskManageService {

    constructor(
        // private apiClient: ApiClientService,
        private taskConverter: TaskConverter,
        @Inject(TASK_CONFIG) private config: TaskConfig,
        // private taskDataManagerCollection: TaskDataManagerCollection,
        // private workflowManager: TaskWorkflowManagerService,
        private locationTracker: LocationTracker
        // private user: UserService
    ) {
    }

    init() {
        this.refreshAll();
    }

    getDataManager(taskStatus: TaskStatus) {
        // return this.taskDataManagerCollection.getDataManager(taskStatus);
    }

    nextStatus(task: Task) {
        // let oldStatus = task.CurrentStatus.code;
        // this.workflowManager.next(task)
        //     .then(task => {
        //         this.taskDataManagerCollection.removeFromDataSource(oldStatus, [task]);
        //         this.taskDataManagerCollection.updateToDataSource([task]);
        //         this.updateTrackerStat();
        //     }).catch(error => {
        //         console.log(error);
        //     });
    }

    updateTrackerStat() {
        // if (this.taskDataManagerCollection.getDataManager(TaskStatus.BeginExecuted).Items.length > 0) {
        //     this.locationTracker.enableTrack();
        //     this.locationTracker.startTrack();
        // }
        // else
        //     this.locationTracker.stopTrack();
    }

    updateTask(task: Task) {
        // this.apiClient.put(`${this.baseUrl}`, task).then(function (data) {
        //     this.taskDataManagerCollection.updateToDataSource([task]);
        // })

    }

    countOfRemind(taskStatus: TaskStatus) {
        // return this.taskDataManagerCollection.getRemindCount(taskStatus);
    }

    baseUrl = "api/task"
    refreshData(taskStatus: TaskStatus) {
        // let status = EnumUtil.GetEnumString(TaskStatus, taskStatus);
        // let promise = this.apiClient.get(`${this.baseUrl}?executantId=${this.user.Current.UserId}&status=${status}&pageIndex=0&pageSize=20`);
        // promise.then(function (data) {
        //     let tasks = data.Records.map(this.taskConverter.toTask)
        //     this.taskDataManagerCollection.reset(taskStatus, tasks);
        //     if (taskStatus == TaskStatus.BeginExecuted)
        //         this.updateTrackerStat();
        //     return tasks;
        // }.bind(this))
        // return promise;
    }

    refreshTask(id: number) {
        // if (!id)
        //     return;
        // let promise = this.apiClient.get(`${this.baseUrl}/${id}`);
        // promise.then(function (data) {
        //     let task = this.taskConverter.toTask(data);
        //     this.taskDataManagerCollection.updateToDataSource([task]);
        //     return task;
        // }.bind(this))
        // return promise;
    }

    refreshAll() {
        this.config.receivedTaskStatus.map(this.refreshData.bind(this));
    }

    /*
     * Note About 
     */
    addNote(noteContent, task: Task) {
        // let note = new Note();
        // note.Author = new Member();
        // note.Author.UserId = this.user.Current.UserId;
        // note.Author.UserName = this.user.Current.UserName;
        // note.Content = noteContent;
        // note.CreateTime = new Date();
        // if (!task.NoteList)
        //     task.NoteList = [];

        // this.apiClient.post(`${this.baseUrl}/${task.Id}/note`, note).then((data) => {
        //     this.refreshTask(task.Id);
        // });
        // task.NoteList.push(note);
    }

}
