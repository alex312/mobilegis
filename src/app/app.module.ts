import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MenuConfig } from './menu-config';
import { AlarmConfig } from './alarm-config';
import { Config } from './config';

import { BaseModule } from './base';
import { CommonEntryModule } from './entry-page/common';
import { ShipDynamicModule } from './plugins/ship-dynamic';
import { ArticleModule } from './plugins/article';
// import { UserModule } from './plugins/user';
import { SearchModule } from './plugins/search';
import { ShipModule } from './plugins/ship';
import { TrafficEnvModule } from './plugins/traffic-env';
import { AlarmModule } from './plugins/alarm';
import { SectionObserverModule } from './plugins/section-observer';
import { CCTVModule } from './plugins/cctv';
import { TaskModule } from './plugins/task';

@NgModule({
  id: "AppModule",
  declarations: [
    MyApp,
  ],
  imports: [
    CommonEntryModule,
    ArticleModule,
    ShipDynamicModule,
    SearchModule,
    ShipModule,
    TrafficEnvModule,
    SectionObserverModule,
    CCTVModule,
    TaskModule.forRoot(Config.taskConfig),
    AlarmModule.forRoot(AlarmConfig),
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      iconMode: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {

}
