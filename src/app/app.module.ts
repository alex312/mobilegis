import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';

import { MyApp } from './app.component';

// import { MenuConfig } from './menu-config';
// import { AlarmConfig } from './alarm-config';
import { Config } from './config';

import { BaseModule } from './base';
import { CommonEntryModule } from './entry-page/common';
// import { TJVTSEntryModule } from './entry-page/tjvts';
import { ShipDynamicModule } from './plugins/ship-dynamic';
import { ArticleModule } from './plugins/article';
// import { UserModule } from './plugins/user';
import { SearchModule } from './plugins/search';
import { ShipModule } from './plugins/ship';
import { TrafficEnvModule } from './plugins/traffic-env';
import { AlarmModule } from './plugins/alarm';
import { SectionObserverModule } from './plugins/section-observer';
import { CCTVModule } from './plugins/cctv';
import { LocationModule } from './plugins/location';
import { TaskModule } from './plugins/task';

@NgModule({
  id: "AppModule",
  declarations: [
    MyApp,
  ],
  imports: [
    BaseModule.forRoot(),
    CommonEntryModule,
    // TJVTSEntryModule,
    ArticleModule.forRoot(Config.Plugins.article),
    ShipDynamicModule,
    SearchModule,
    ShipModule,
    TrafficEnvModule,
    SectionObserverModule,
    CCTVModule.forRoot(Config.Plugins.cctv),
    LocationModule.forRoot(Config.Plugins.location),
    TaskModule.forRoot(Config.taskConfig),
    AlarmModule.forRoot(Config.Plugins.alarm),
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
  // constructor() {
  //   let appVersion: AppVersion = AppVersion.getPlugin();
  //   appVersion.getAppName().then(console.log);
  //   appVersion.getPackageName().then(console.log);
  //   appVersion.getVersionCode().then(console.log);
  //   appVersion.getVersionNumber().then(console.log);
  // }
}
