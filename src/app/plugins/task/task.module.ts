import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { BaseModule } from "../../base";
// import { LocationModule } from '../location'
import { UserModule } from '../user';

import { TaskDataManagerCollection } from './service/task-data-manager-collection.service';
import { TaskManageService } from './service/task-manage.service';
import { ExecuteUnitService } from './service/execute-unit.service';
import { TaskConfig, TASK_CONFIG } from './config';
import { TaskWorkflowManagerService } from './service/task-workflow-manager.service';
import { MemberConverter } from './service/converters/member-converter.service';
import { TaskConverter } from './service/converters/task-converter.service';
import { ExecuteRecordService } from './service/execute-record.service';
import { AttachmentService } from './service/attachment.service';
import { AttachmentEditService } from './service/attachment-edit.service';
import { MembersService } from './service/members.service'
import { EquipmentsService } from './service/equipments.service'
import { VehiclesService } from './service/vehicles.service'

import { TaskListPage } from './page/task-list.page';
import { TaskCardComponent } from './component/task-card.component';
import { TaskDetailPage } from './page/task-detail.page';
import { TaskUnionModelContentPage } from './page/task-unit-edit-modal.page';
import { RecordListPage } from './page/record-list.page';
import { ExecutionRecordModelContentPage } from './page/execution-record-modal.page';


let taskDataManagerCollectionFactory = (taskConfig: TaskConfig) => {
    return new TaskDataManagerCollection(taskConfig.receivedTaskStatus);
}

@NgModule({
    id: "TaskModule",
    imports: [
        CommonModule,
        FormsModule,
        BaseModule,
        IonicModule,
        // LocationModule,
        UserModule
    ],
    exports: [

    ],
    entryComponents: [
        TaskListPage,
        TaskDetailPage,
        TaskUnionModelContentPage,
        RecordListPage,
        ExecutionRecordModelContentPage
    ],
    declarations: [
        TaskListPage,
        TaskCardComponent,
        TaskDetailPage,
        TaskUnionModelContentPage,
        RecordListPage,
        ExecutionRecordModelContentPage
    ],
    providers: [
    ],
})
export class TaskModule {
    static forRoot(taskConfig: TaskConfig): ModuleWithProviders {
        return {
            ngModule: TaskModule,
            providers: [
                { provide: TASK_CONFIG, useValue: taskConfig },
                {
                    provide: TaskDataManagerCollection,
                    useFactory: taskDataManagerCollectionFactory,
                    deps: [TASK_CONFIG]
                },
                MembersService,
                ExecuteUnitService,
                EquipmentsService,
                VehiclesService,
                TaskManageService,
                TaskWorkflowManagerService,
                MemberConverter,
                TaskConverter,
                ExecuteRecordService,
                AttachmentService,
                AttachmentEditService
            ]
        }
    }
}