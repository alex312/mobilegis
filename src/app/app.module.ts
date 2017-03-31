import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MenuPage, Menu_Config } from './plugins/menu';
import { MenuConfig } from './menu-config';
import { AlarmConfig } from './alarm-config';

import { ApiClientService, ItemLabelComponent, WebGISInteractiveService } from './base';
import { SeecoolGISComponent, MapPage, FeatureInfoComponent } from './plugins/map';
import { ShipDynamicComponent, ShipArchiveComponent, ShipInfoComponent, ShipDetailPage, NearbyShipComponent, VesselGroupPage, VesselGroupService } from './plugins/ship';
import { TrafficEnvInfoComponent } from './plugins/traffic-env';
import { TrafficEnvDetailComponent, TrafficEnvService } from './plugins/traffic-env';

import { SectionServerChartService, SectionObserverService, SectionObserverPage } from './plugins/section-observer';

import { GroupComponent, AlarmService, Alarm_Config, AlarmPage } from './plugins/alarm';

import { CCTVComponent, CCTVNodeListComponent, CCTVDataService } from './plugins/cctv';

import { ShipDynamicModule } from './plugins/ship-dynamic';
import { ArticleModule } from './plugins/article';
import { UserModule } from './plugins/user';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    SeecoolGISComponent,
    FeatureInfoComponent,
    ItemLabelComponent,
    SeecoolGISComponent,
    MapPage,
    FeatureInfoComponent,
    TrafficEnvDetailComponent,
    ShipInfoComponent,
    TrafficEnvInfoComponent,
    ShipDetailPage,
    NearbyShipComponent,
    ShipArchiveComponent,
    ShipDynamicComponent,
    MenuPage,
    GroupComponent,
    SectionObserverPage,
    VesselGroupPage,
    AlarmPage, CCTVComponent, CCTVNodeListComponent,
  ],
  imports: [
    ArticleModule,
    ShipDynamicModule,
    UserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      iconMode: "ios"
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    ShipDetailPage,
    MenuPage,
    SectionObserverPage,
    VesselGroupPage,
    AlarmPage, CCTVComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Menu_Config, useValue: MenuConfig },
    { provide: Alarm_Config, useValue: AlarmConfig },
    WebGISInteractiveService,
    ApiClientService,
    SectionServerChartService,
    SectionObserverService,
    AlarmService,
    VesselGroupService,
    TrafficEnvService,
    CCTVDataService
  ]
})
export class AppModule { }
