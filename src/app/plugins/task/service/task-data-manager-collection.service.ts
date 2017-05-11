import { Injectable } from '@angular/core';

import { Task } from '../data/task';

import { TaskStatus } from '../data/metadata';

import { DataManager, EnumUtil } from '../../../base'

// import { Util } from '../../util/utils';


@Injectable()
export class TaskDataManagerCollection {
    dataManagerCollection: { [key: string]: { dataSource: DataManager<Task>, remindCount: number } };
    constructor(status: TaskStatus[]) {
        this.init(status);
    }

    getDataManager(taskStatus: TaskStatus) {
        let propertyName = this.getPropertyName(taskStatus);
        return this.dataManagerCollection[propertyName].dataSource;
    }

    getRemindCount(taskStatus: TaskStatus) {
        let propertyName = this.getPropertyName(taskStatus);
        return this.dataManagerCollection[propertyName].remindCount;
    }

    updateToDataSource(tasks: Task[]) {
        tasks.map(t => {
            let taskCollection: DataManager<Task> = this.getDataManager(t.CurrentStatus.code);
            taskCollection.addOrUpdate(t, this.taskPredicate);
        });
    }

    removeFromDataSource(taskStatus, tasks: Task[]) {
        tasks.map(t => {
            let taskCollection: DataManager<Task> = this.getDataManager(taskStatus);
            taskCollection.remove(t, this.taskPredicate);
        });
    }

    reset(taskStatus, tasks: Task[]) {
        let taskCollection = this.getDataManager(taskStatus);
        taskCollection.reset(tasks);
    }

    private taskPredicate(oldTask: Task, newTask: Task) {
        return oldTask.Id === newTask.Id;
    }

    private init(taskStatus: TaskStatus[]) {
        this.dataManagerCollection = {};
        taskStatus.map(this.createDataManager.bind(this));
    }

    private createDataManager(taskStatus: TaskStatus) {
        let propertyName: string = this.getPropertyName(taskStatus);
        // this[dataSourceName] = new DataManagerService();
        let obj = this.dataManagerCollection[propertyName];
        if (obj)
            throw Error(`已经注册了名为${propertyName}的数据源`);
        this.dataManagerCollection[propertyName] = { dataSource: new DataManager<Task>(), remindCount: 0 };
    }

    private getPropertyName(taskStatus: TaskStatus) {
        let key: any = EnumUtil.GetEnumString(TaskStatus, taskStatus);

        return key;
    }
}


