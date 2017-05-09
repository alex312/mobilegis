// import { TaskDataManagerCollection } from './service/task-data-manager-collection.service';
// import { TaskManageService } from './service/task-manage.service';
// import { ExecuteUnitService } from './service/execute-unit.service';
// import { TaskConfig, TASK_CONFIG } from './config';
// import { TaskWorkflowManagerService } from './service/task-workflow-manager.service';
// import { MemberConverter } from './service/converters/member-converter.service';
// import { TaskConverter } from './service/converters/task-converter.service';
// import { ExecuteRecordService } from './service/execute-record.service';
// import { AttachmentService } from './service/attachment.service';
// import { AttachmentEditService } from './service/attachment-edit.service';
// import { MembersService } from './service/members.service'
// import { EquipmentsService } from './service/equipments.service'
// import { VehiclesService } from './service/vehicles.service'



// let taskDataManagerCollectionFactory = (taskConfig: TaskConfig) => {
//     return new TaskDataManagerCollection(taskConfig.receivedTaskStatus);
// }

// export let taskDataManagerCollectionProvider = {
//     provide: TaskDataManagerCollection,
//     useFactory: taskDataManagerCollectionFactory,
//     deps: [TASK_CONFIG]
// }

// export const Task_Manager_Providers = [
//     MembersService,
//     EquipmentsService,
//     VehiclesService,
//     ExecuteUnitService,
//     taskDataManagerCollectionProvider,
//     TaskManageService,
//     TaskWorkflowManagerService,
//     MemberConverter,
//     TaskConverter,
//     ExecuteRecordService,
//     AttachmentService,
//     AttachmentEditService
// ]