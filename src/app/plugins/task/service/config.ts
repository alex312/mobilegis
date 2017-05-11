import { OpaqueToken } from '@angular/core'
import { TaskStatus } from '../data/metadata';

export let TASK_CONFIG = new OpaqueToken("task.config");

export interface TaskConfig {
    receivedTaskStatus: TaskStatus[];
    perBlockSize: number;
}