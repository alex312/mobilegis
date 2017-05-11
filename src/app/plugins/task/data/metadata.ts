import { CodeDictionary } from '../data/code-dictionary';

export enum TaskStatus {
    PendingApprove = 1,     // 待审核
    PendingDispatch = 2,    // 待派发
    PendingReceive = 3,     // 待领取
    PendingExecution = 4,// 待执行
    BeginExecuted = 5,//执行中
    Completed = 6, //已完成
    Closed = 7 // 已结束
}

export const TASK_STATUSES: CodeDictionary[] = [
    { code: TaskStatus.PendingApprove, description: "待审核" },
    { code: TaskStatus.PendingDispatch, description: "待派发" },
    { code: TaskStatus.PendingReceive, description: "待领取" },
    { code: TaskStatus.PendingExecution, description: "待执行" },
    { code: TaskStatus.BeginExecuted, description: "执行中" },
    { code: TaskStatus.Completed, description: "已完成" },
    { code: TaskStatus.Closed, description: "已结束" },
]
export function findTaskStatusCodeDictionary(taskStatus: string) {
    for (let status of TASK_STATUSES) {
        if (TaskStatus[status.code] === taskStatus) {
            return status;
        }
    }
    return null;
}
export enum TaskType {
    TrafficManagement = 1,  //  通航管理
    ShipSupervision = 2,    // 船舶监管
    CrewManagement = 3, // 船员管理
    RiskPreventionManagement = 4, // 危防管理
    EmergencyHandling = 5, // 应急处置
    CompanyManagement = 6, // 公司管理
    TemporaryTask = 7, // 临时任务
}


export const TASK_TYPES: CodeDictionary[] = [
    { code: TaskType.TrafficManagement, description: "通航管理" },
    { code: TaskType.ShipSupervision, description: "船舶监管" },
    { code: TaskType.CrewManagement, description: "船员管理" },
    { code: TaskType.RiskPreventionManagement, description: "危防管理" },
    { code: TaskType.EmergencyHandling, description: "应急处理" },
    { code: TaskType.CompanyManagement, description: "公司管理" },
    { code: TaskType.TemporaryTask, description: "临时任务" },
]
export function findTypeCodeDictionary(taskType: string) {
    for (let type of TASK_TYPES) {
        if (TaskType[type.code] === taskType) {
            return type;
        }
    }
    return null;
}