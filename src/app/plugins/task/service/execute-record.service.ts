//execute-record.service
import { Injectable } from '@angular/core';

import { ApiClientService, DataManager } from '../../../base';
import { ExecutionRecord } from '../data/execution-record';

@Injectable()
export class ExecuteRecordService {
    dataSource = new DataManager<ExecutionRecord>();
    constructor(private apiClient: ApiClientService) {

    }

    getRecords(taskId: number) {
        let result: ExecutionRecord[] = [];
        this.dataSource.Items.map(t => {
            if (t.TaskId === taskId)
                result.push(t);
        })
        return result;
    }

    baseUrl = "api/record";
    update(record: ExecutionRecord) {
        let promise = this.apiClient.put(`${this.baseUrl}/${record.Id}`, record);
        promise.then(() => {
            this.dataSource.addOrUpdate(record, (left, right) => left.Id === right.Id);
        });
        // this.dataSource.addOrUpdate(record, (left, right) => left.Id === right.Id);
        return promise;
    }

    create(record: ExecutionRecord) {
        let promise = this.apiClient.post(this.baseUrl, record);
        promise.then((record) => {
            this.dataSource.addOrUpdate(record, (left, right) => left.Id === right.Id);
        })
        return promise;
    }

    refreshRecords(taskIds: number[]) {
        var promises = taskIds.map((taskId) => {
            return this.apiClient.get(`${this.baseUrl}?taskId=${taskId}`).then((records) => {
                records.forEach((record) => { this.dataSource.addOrUpdate(record, (a, b) => { return a.Id === b.Id }); })
            })
        })
        Promise.all(promises).then();
    }
}
