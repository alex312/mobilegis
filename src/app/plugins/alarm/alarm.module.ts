import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { AlarmPage } from './page/alarm.page';

import { GroupComponent } from './component/group.component';

import { alarmServiceProvider } from './service/alarm.service';
import { Alarm_Config, IAlarmConfig } from './service/config';

@NgModule({
    id: "AlarmModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        GroupComponent
    ],
    entryComponents: [
        AlarmPage,

    ],
    declarations: [
        AlarmPage,
        GroupComponent
    ],
    providers: [
    ],
})
export class AlarmModule {
    static forRoot(alarmConfig: IAlarmConfig): ModuleWithProviders {
        console.log("alarm module");
        return {
            ngModule: AlarmModule,
            providers: [
                { provide: Alarm_Config, useValue: alarmConfig },
                alarmServiceProvider
            ]
        }
    }
}