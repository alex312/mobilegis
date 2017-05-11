import { Injectable } from '@angular/core';
import { Task } from '../data/task';
import { TaskStatus, TASK_STATUSES } from '../data/metadata'
import { ApiClientService } from '../../../base'

@Injectable()
export class TaskWorkflowManagerService {
    static url = "api/task/"
    constructor(private apiClient: ApiClientService) {

    }
    next(task: Task) {
        let taskStatus = task.CurrentStatus.code;

        let nextStatus = TASK_STATUSES[taskStatus];

        let promise = this.apiClient.put(`${TaskWorkflowManagerService.url}${task.Id}/${TaskStatus[nextStatus.code]}`).then(data => {

            task.CurrentStatus = nextStatus;
            return task;
        });

        return promise;
    }
}