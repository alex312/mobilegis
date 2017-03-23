// import {Menu} from './common/menu.entity';
// import {MapPage} from './pages/map/map.page';
import { MapPage } from './plugins/map';
// import {SectionChartPage} from './pages/section/section-chart.page';
// import {ObservationSectionPage} from './pages/section/observation-section.page';
import { SectionObserverPage } from './plugins/section-observer';
// import { PatrolBoatPage } from './pages/patrolboat/patrolboat.page';
// import { BlackListPage } from './pages/blacklist/blacklist.page';
// import {TaskListTabsPage} from './pages/task/task-list-tabs.page';
// import {AlarmPage} from './pages/alarm/alarm.page';
import { AlarmPage } from './plugins/alarm';
// import {MenuItemPage} from './pages/menu/menu-item.page';
import { IMenuConfig } from './plugins/menu';
// import {AlarmTabPage} from './pages/alarm/alarm-tab.page';
// import {MenuItem} from './menu/entitys/menu-item.entity';
// import {IMenuConfig} from './menu/config';
import { VesselGroupPage } from './plugins/ship';

import { CCTVComponent } from './plugins/cctv';

export const MenuConfig: IMenuConfig = {
    WidthThreshold: 600,
    Menu: {
        Name: 'MobileGIS',
        Page: undefined,
        Icon: undefined,
        SubMenuItems: [
            {
                Name: '海图',
                Page: MapPage,
                Icon: 'seamap',
                SubMenuItems: undefined,
                Params: undefined
            },
            {
                Name: '观测截面',
                Page: SectionObserverPage,
                Icon: 'section',
                SubMenuItems: undefined,
                Params: undefined
            },
            {
                Name: '我的船队',
                Page: VesselGroupPage,
                Icon: 'subjectShip',
                SubMenuItems: undefined,
                Params: undefined
            },
            // {
            //     Name: '专题船舶',
            //     Page: MenuItemPage,
            //     Icon: 'subjectShip',
            //     SubMenuItems: [
            //         {
            //             Name: '海巡船',
            //             Page: PatrolBoatPage,
            //             Icon: 'user',
            //             SubMenuItems: undefined,
            //             Params: undefined
            //         },
            //         {
            //             Name: '黑名单船舶',
            //             Page: BlackListPage,
            //             Icon: 'subjectShip',
            //             SubMenuItems: undefined,
            //             Params: undefined
            //         },
            //     ],
            //     Params: undefined
            // },
            // {
            //     Name: '巡航管理',
            //     Page: MenuItemPage,
            //     Icon: 'cruise',
            //     SubMenuItems: [
            //         {
            //             Name: '巡航任务',
            //             Page: TaskListTabsPage,
            //             Icon: 'user',
            //             SubMenuItems: undefined
            //         },
            //         {
            //             Name: '巡航计划',
            //             Icon: 'cruise',
            //             Page: undefined,
            //             SubMenuItems: undefined
            //         },
            //     ]
            // },
            {
                Name: '实时报警',
                Page: AlarmPage,
                Icon: 'alarm',
                SubMenuItems: undefined,
                Params: undefined
            },
            {
                Name: 'CCTV',
                Page: CCTVComponent,
                Icon: 'alarm',
                SubMenuItems: undefined,
                Params: undefined
            },
            // {
            //     Name: '个人中心',
            //     Icon: 'user',
            //     Page: undefined,
            //     SubMenuItems: undefined,
            //     Params: undefined
            // }
        ],
        Params: undefined
    }
}