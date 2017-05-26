import { OpaqueToken } from '@angular/core'

export let TASK_CONFIG = new OpaqueToken("task.config");

export interface TaskConfig {
    receivedTaskStatus: string[];
    perBlockSize: number;
}