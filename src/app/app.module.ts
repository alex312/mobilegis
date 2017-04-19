import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
// import { MenuPage, Menu_Config } from './plugins/menu';
import { MenuConfig } from './menu-config';
import { AlarmConfig } from './alarm-config';

// import { SeecoolGISComponent, FeatureInfoComponent } from './plugins/map';
import { ShipDetailPage, VesselGroupPage, VesselGroupService } from './plugins/ship';

import { SectionServerChartService, SectionObserverService, SectionObserverPage } from './plugins/section-observer';

import { GroupComponent, AlarmService, Alarm_Config, AlarmPage } from './plugins/alarm';

import { CCTVComponent, CCTVNodeListComponent, CCTVDataService } from './plugins/cctv';


import { BaseModule } from './base';
import { ShipDynamicModule } from './plugins/ship-dynamic';
import { ArticleModule } from './plugins/article';
import { UserModule } from './plugins/user';
import { LoadingModule } from './plugins/loading';
import { MapModule } from './plugins/map';
import { SearchModule } from './plugins/search';
import { ShipModule } from './plugins/ship';
import { TrafficEnvModule } from './plugins/traffic-env';
import { MenuModule } from './plugins/menu';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    // SeecoolGISComponent,
    // FeatureInfoComponent,
    ShipDetailPage,
    GroupComponent,
    SectionObserverPage,
    VesselGroupPage,
    AlarmPage, CCTVComponent, CCTVNodeListComponent,
  ],
  imports: [
    BaseModule,
    ArticleModule,
    ShipDynamicModule,
    UserModule,
    LoadingModule,
    MapModule,
    SearchModule,
    ShipModule,
    TrafficEnvModule,
    MenuModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      iconMode: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ShipDetailPage,
    SectionObserverPage,
    VesselGroupPage,
    AlarmPage, CCTVComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Menu_Config, useValue: MenuConfig },
    { provide: Alarm_Config, useValue: AlarmConfig },

    SectionServerChartService,
    SectionObserverService,
    AlarmService,
    VesselGroupService,
    CCTVDataService
  ]
})
export class AppModule { }
