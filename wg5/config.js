define({
    manifest: {
        "ui/frame": { type: "ui/defaultFrame" },
        "ui/menu": { type: "ui/defaultMenu" },//{type: "install/menu"},//
        "frameAlert": { type: "ui/defaultAlert" },

        //webgis{
        "maps/ui/frame": { type: "maps/ui/frame" },
        "maps/map": { "maps/iMapFrame": "maps/ui/frame" },
        "maps/ui/uiFrame": { "maps/ui/iUiFrame": "maps/ui/frame" },
        "maps/layers/interAction": { map: "maps/map" },
        "maps/layers/gcjmStatisticsUi": { gcjmStatistics: "maps/layers/gcjmStatistics" },
        "maps/mapUi": { map: "maps/map" },
        //}

        //mobile{
        // "ui/mobileFrame": {"ui/defaultContainer": "mobile/ui/defaultContainer"},
        "mobile/frameAlert": { type: "ui/defaultAlert", deps: { "ui/frame": "ui/mobileFrame" } },
        "mobile/maps/tools/layersSetting": { type: "maps/tools/layersSetting", deps: { "maps/map": "mobile/maps/map" } },
        "mobile/maps/map": { type: 'maps/map', deps: { "maps/iMapFrame": "ui/mobileFrame" } },//mobile/maps/ui/frame
        "mobile/maps/layers/interAction": { type: 'maps/layers/interAction', deps: { map: "mobile/maps/map" } },
        'mobile/maps/layers/ships': {
            type: 'maps/layers/ships',
            deps: {
                'maps/map': 'mobile/maps/map',
                "maps/tools/layersSetting": "mobile/maps/tools/layersSetting",
                "frameAlert": "mobile/frameAlert"
            }
        },
        "mobile/maps/layers/thhj": {
            type: "maps/layers/thhj",
            deps: { "maps/map": "mobile/maps/map", "maps/tools/layersSetting": "mobile/maps/tools/layersSetting" }
        },
        "mobile/maps/layers/cctv": {
            type: "maps/layers/cctv",
            deps: { "maps/map": "mobile/maps/map", "maps/tools/layersSetting": "mobile/maps/tools/layersSetting" }
        },
        //}

        //playback{
        "ui/playbackMenu": { type: "ui/defaultMenu" },
        "ui/playbackDefaultContainer": { type: "ui/defaultContainer", deps: "ui/playbackFrame" },
        "maps/ui/playbackFrame": {
            type: "maps/ui/playbackFrame",
            deps: { "ui/menu": "ui/playbackMenu", "ui/defaultContainer": "ui/playbackDefaultContainer" }
        },
        "maps/playbackMap": { type: "maps/map", deps: { "maps/iMapFrame": "maps/ui/playbackFrame" } },
        "maps/ui/playbackUiFrame": { type: "maps/ui/uiFrame", deps: { "maps/ui/iUiFrame": "maps/ui/playbackFrame" } },
        "maps/layers/playbackInterAction": { type: "maps/layers/interAction", deps: { map: "maps/playbackMap" } },
        "maps/playbackMapUi": { type: "maps/mapUi", deps: { map: "maps/playbackMap" } },
        "maps/layers/playback2": { map: "maps/playbackMap", root: "root" },
        "maps/ui/playbackDetailViewer": {
            type: "maps/ui/detailViewer",
            deps: { "maps/map": "maps/playbackMap", "maps/ui/uiFrame": "maps/ui/playbackUiFrame" }
        },
        "maps/layers/playbackUi": {
            frame: "maps/ui/playbackUiFrame",
            playback: "maps/layers/playback2",
            interAction: "maps/layers/playbackInterAction",
            detailViewer: "maps/ui/playbackDetailViewer"
        },
        //}
    },
    pages: {
        index: {
            plugins: [
                'user/info',    //用户信息
                'message',    //用户消息
                'help',    //帮助

                'ui/frame',    //整体框架
                'ui/menu',    //左侧菜单栏
                'user/infoView',     //用户信息UI(右上角用户信息)
            ]
        },
        mobile: {
            default: true,
            mainPlugin: "ui/mobileFrame",
            plugins: [
                'ui/mobileFrame',
                'mobile/maps/map',
                'mobile/maps/layers/interAction',
                'mobile/maps/layers/ships',
                "mobile/maps/layers/thhj",
                "mobile/maps/layers/cctv"
            ]
        },
        playback: {
            mainPlugin: "maps/ui/playbackFrame",
            plugins: [
                //core （非UI）
                'user/info',    //用户信息
                'message',    //用户消息
                'help',    //帮助
                'ui/playbackMenu',    //左侧菜单栏
                'user/infoView',     //用户信息UI(右上角用户信息)

                'maps/ui/playbackFrame',    //地图页面框架
                'maps/ui/playbackUiFrame',
                'maps/playbackMap',  //地图
                "maps/layers/playbackInterAction",
                'maps/ui/playbackDetailViewer',    //地图详情单
                'maps/layers/playback2',    //回放
                'maps/layers/playbackUi',    //回放Ui
                // 'maps/ui/search',    //地图搜索
                // 'maps/tools/layersSetting',    //
                //'maps/layers/ships',    //船舶
            ],
        },
        install: {
            plugins: [
                'install/collector',

                //core （非UI）
                'maps/map',  //地图
                'maps/layers/plot',  //标绘
                'maps/layers/thhj',  //通航环境
                'maps/layers/taskMembers',  //任务人员（威海）
                'maps/layers/ships',    //船舶
                'maps/layers/playback2',    //回放
                'user/info',    //用户信息
                'message',    //用户消息
                'help',    //帮助
                //}

                //mobile{
                //'maps/iMapFrame:ui/mobileFrame',
                //}

                //webgis{
                'ui/frame',    //整体框架
                'ui/menu',    //左侧菜单栏
                'user/infoView',     //用户信息UI(右上角用户信息)
                // 'fujianUser',    //用户信息（福建）
                'maps/ui/frame',    //地图页面框架
                'maps/ui/detailViewer',    //地图详情单
                'maps/ui/search',    //地图搜索
                'maps/tools/setting',    //地图设置
                'maps/tools/legend',    //地图图例
                'maps/tools/measure',    //地图量算
                'maps/tools/location',    //地图定位
                'maps/layers/interAction',
                'maps/mapUi',   //地图Ui
                'maps/layers/shipsUi',    //船舶UI
                'maps/layers/shipArchive',    //船舶档案
                'maps/layers/thhjUi',    //通航环境UI
                'maps/layers/plotUi',    //标绘UI
                'maps/layers/workView',    //工作区
                'maps/layers/taskMembersUi',    //任务人员（威海）
                'maps/layers/gcjmStatistics',    //观测截面
                'maps/layers/gcjmStatisticsUi',    //观测截面UI

                'maps/layers/taskUi',    //任务列表（威海）
                'maps/layers/cctv',    //CCTV
                'maps/layers/anchorageEvent',    //锚泊事件
                'maps/layers/portShip',    //在港船舶
                'maps/layers/berth',    //泊位
                //'maps/layers/waterDepth',    //水深
                'maps/layers/shipTeam',    //我的船队
                'maps/layers/boxSelectStatistics',    //圈选统计
                'maps/layers/historyRITSQuery',    //智能报警历史查询
                'maps/layers/ritsEvent',    //智能报警
                'maps/layers/specialShip',    //专题船舶
                // }

                //comMis{
                'comMis/userManage',    //用户管理
                //}

                //weihai{
                'weihai/taskManagement',    //任务管理（威海）
                //'weihai/zcData',    //中创数据（威海）
                //}

                //fujian{
                'comMis/cargoShip',    //货船申报（福建）
                'comMis/passengerShip',    //客船申报（福建）
                'comMis/waterWork',    //水工作业（福建）
                'maps/layers/fujianUserManage',    //福建申报用户管理（福建）
                //'maps/layers/fujianWaterWorkView',    //水工作业显示（福建）
                //'maps/layers/shipDeclaration',    //动态申报（福建）
                //}

                //pudong{
                'comMis/VTS',    //船舶动态申报与查询（港口普通用户）（浦东）
                'comMis/VTSMarine',    //船舶动态查询（海事局用户）（浦东）
                //}

                // "playback": [
                // //core
                // 'maps/map',
                // 'maps/layers/plot',
                // 'maps/layers/thhj',
                // 'user/info',
                // //}
                //
                // //mobile{
                // //'maps/iMapFrame:ui/mobileFrame',
                // //}
                //
                // //webgis{
                // 'ui/frame',
                // 'ui/menu',
                // 'user/infoView',
                // 'maps/ui/frame',
                // 'maps/ui/detailViewer',
                // 'maps/ui/search',
                // 'maps/layers/workView',
                // 'maps/layers/playback2',
                // 'maps/layers/interAction',
                'maps/layers/playbackUi',
                // // }
                // ],
            ]
        },
    },
    pageManager: "pageManager",
    values: {
        apiHostIp: appConfig.apiHostIp,//"192.168.9.131",
        apiHostPort: appConfig.apiHostPort,//"9007",
        apiRoot: appConfig.map.apiRoot, //"/wg5"
    },
    plugins: {
        "pageManager": {
            actions: {
                "playback": "maps/layers/playbackUi",
                "shipFocus": "maps/layers/shipsUi"
            }
        },
        "maps/ui/frame": {
            name: 'webgis',
            label: 'Webgis',
            iconFont: 'si-map',
            menuIndex: 1
        },
        "mobile/maps/ui/frame": {
            name: 'mobile',
            label: 'mobile',
            iconFont: 'si-map',
            menuIndex: 1
        },
        "user/info": {
            userConfigData: "api/userConfigData"
        },
        "maps/map": {
            center: [117.8, 38.95],
            zoom: 14,
            minZoom: 3,
            maxZoom: 18,
            baseLayer: {
                sources: [
                    {
                        title: 'OpenStreetMap',
                        provider: 'ol.source.OSM'
                    },
                    {
                        title: '标准海图',
                        provider: 'ol.source.XYZ',
                        options: {
                            url: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/MapService?service=wmts&request=gettile&tilematrixset=advsea&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/png&layer=default&style=default&version=1.0.0")
                        }
                    },
                    {
                        default: true,
                        title: '基础海图+路图',
                        provider: 'ol.source.XYZ',
                        options: {
                            url: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/MapService?service=wmts&request=gettile&tilematrixset=basicsearoad&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/png&layer=default&style=default&version=1.0.0")
                        }
                    }
                ]
            }
        },
        "maps/layers/ships": {
            // tileUrl: 'http://192.168.9.131:9007/wg5/api/shiptile/tile',
            // tileVersionUrl: 'http://192.168.9.131:9007/wg5/api/shiptile/tile',
            // rtds: 'ws://192.168.9.131:9007/wg5/api/rtds',
            // shiphistoryApi: 'http://192.168.9.131:9007/wg5/shiphistory/api',
            // signalApi: 'api/ships/signal',
            tileUrl: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/shiptile/tile"),
            tileVersionUrl: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/shiptile/tile"),
            rtds: $.format('ws://${apiHostIp}:${apiHostPort}${apiRoot}/api/rtds'),
            shiphistoryApi: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/shiphistory"),
            signalApi: $.format("http://${apiHostIp}:${apiHostPort}/api/ships/signal"),
            expires: 60 * 60 * 3,
            zIndex: 1,
            zoom: 3
        },
        // "maps/layers/plot": {
        //     plotInfoApi: 'api/plotInfo',
        //     zIndex: 2,
        //     zoom: 12
        // },
        "maps/layers/thhj": {
            locationApi: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}//api/location"),
            defaultTrafficEnvStyleApi: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/DefaultTrafficEnvStyle"),
            zIndex: 3,
            zoom: 10
        },
        // "maps/tools/legend": {
        //     toolIndex: 1
        // },
        // "maps/tools/measure": {
        //     toolIndex: 2
        // },
        // "maps/tools/setting": {
        //     toolIndex: 3
        // },
        // "maps/tools/location": {
        //     toolIndex: 4
        // },
        // "user/infoView": {
        //     infoIndex: -1
        // },
        // "message": {
        //     infoIndex: -2
        // },
        // "maps/ui/detailViewer": {
        //     items: [
        //         {
        //             name: "shipLayerSelectFocus",
        //             detailIndex: 1,
        //             action: $.action("webgis", "maps/layers/shipsUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "plotSelectFocus",
        //             detailIndex: 2,
        //             action: $.action("webgis", "maps/layers/plotUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "shipArchive",
        //             // detailIndex:4,
        //             action: $.action("webgis", "maps/layers/shipArchive", "featureSelected_", [])
        //         },
        //         {
        //             name: "cctvSelectFocus",
        //             detailIndex: 4,
        //             action: $.action("webgis", "maps/layers/cctvUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "taskUiFocus",
        //             detailIndex: 5,
        //             action: $.action("webgis", "maps/layers/taskUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "members",
        //             detailIndex: 6,
        //             action: $.action("webgis", "maps/layers/taskMembersUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "gcjmStatisticsUiSelectFocus",
        //             detailIndex: 9,
        //             action: $.action("webgis", "maps/layers/gcjmStatisticsUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "creatTaskFocus",
        //             detailIndex: 10,
        //             action: $.action("webgis", "weihai/creatTask", "featureSelected_", [])
        //         },
        //         {
        //             name: "thhjSelectFocus",
        //             detailIndex: 10,
        //             action: $.action("webgis", "maps/layers/thhjUi", "featureSelected_", [])
        //         },
        //         // {
        //         //     name:"ritsEventSelectFocus",
        //         //     // detailIndex:10,
        //         //     action: $.action("webgis", "maps/layers/ritsEvent", "featureSelected_", [])
        //         // },
        //         // {
        //         //     name:"shipDeclaration",
        //         //     detailIndex:13,
        //         //     action: $.action("webgis", "maps/layers/shipDeclaration", "featureSelected_", [])
        //         // },

        //     ]
        // },
        // "maps/ui/playbackDetailViewer": {
        //     items: [
        //         {
        //             name: "playbackSelectFocus",
        //             detailIndex: 1,
        //             action: $.action("playback", "maps/layers/playbackUi", "featureSelected_", [])
        //         },
        //         {
        //             name: "shipArchive",
        //             // detailIndex:4,
        //             action: $.action("playback", "maps/layers/shipArchive", "featureSelected_", [])
        //         },
        //         // {
        //         //     name:"plotSelectFocus",
        //         //     detailIndex:2,
        //         //     action: $.action("webgis", "maps/layers/plotUi", "featureSelected_", [])
        //         // },
        //     ]
        // },
        // "maps/ui/uiFrame": {
        //     items: [
        //         {
        //             toolIndex: 1,
        //             text: '图例',
        //             icon: 'si-map-signs',
        //             color: '#2ca7e0',
        //             action: $.action("webgis", "maps/tools/legend", "showLegend_", [])
        //         },
        //         {
        //             toolIndex: 2,
        //             text: '量算',
        //             icon: 'si-clone',
        //             color: '#b5e45b',
        //             items: [
        //                 {
        //                     toolIndex: 1,
        //                     text: "距离",
        //                     icon: 'si-ellipsis-v',
        //                     action: $.action("webgis", "maps/tools/measure", "measureLengthInit_", [])
        //                 },
        //                 {
        //                     toolIndex: 2,
        //                     text: "面积",
        //                     icon: 'si-square-o',
        //                     action: $.action("webgis", "maps/tools/measure", "measureAreaInit_", [])
        //                 },
        //                 {
        //                     toolIndex: 3,
        //                     text: "清除",
        //                     icon: 'si-close',
        //                     action: $.action("webgis", "maps/tools/measure", "measureToolsCancal_", [])
        //                 },
        //             ]
        //         },
        //         {
        //             toolIndex: 3,
        //             text: '设置',
        //             icon: 'si-gear',
        //             color: '#ff6600',
        //             action: $.action("webgis", "maps/tools/setting", "showSettingPanel_", [])
        //         },
        //         {
        //             toolIndex: 4,
        //             text: '定位',
        //             icon: 'si-map-marker',
        //             color: '#0abbbb',
        //             action: $.action("webgis", "maps/tools/location", "showPanel_", [])
        //         },
        //         {
        //             toolIndex: 5,
        //             text: '标绘',
        //             icon: 'si-magic',
        //             color: '#ffcc00',
        //             action: $.action("webgis", "maps/layers/plotUi", "init_", [])
        //         },
        //         {
        //             toolIndex: 6,
        //             text: '通航环境',
        //             icon: 'si-th',
        //             color: '#2ca7e0',
        //             action: $.action("webgis", "maps/layers/thhjUI", "thhjList", [])
        //         },
        //         {
        //             toolIndex: 17,
        //             text: '更多',
        //             items: [
        //                 {
        //                     toolIndex: 7,
        //                     text: '工作区',
        //                     icon: 'si-bandcamp',
        //                     color: '#ff6666',
        //                     action: $.action("webgis", "maps/layers/workView", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 8,
        //                     text: '我的船队',
        //                     icon: 'si-ship',
        //                     color: '#66cc99',
        //                     action: $.action("webgis", "maps/layers/shipTeam", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 9,
        //                     text: 'CCTV',
        //                     icon: 'si-videocam',
        //                     color: '#6699ff',
        //                     action: $.action("webgis", "maps/layers/cctvUi", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 10,
        //                     text: '当前任务',
        //                     icon: 'si-tasks',
        //                     color: '#f65398',
        //                     action: $.action("webgis", "maps/layers/taskUi", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 11,
        //                     text: '锚泊事件',
        //                     icon: 'si-anchor',
        //                     color: '#ff9900',
        //                     action: $.action("webgis", "maps/layers/anchorageEventUi", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 12,
        //                     text: '在港船舶统计',
        //                     icon: 'si-pie-chart',
        //                     color: '#01b9fd',
        //                     action: $.action("webgis", "maps/layers/portShip", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 13,
        //                     text: '圈选统计',
        //                     icon: 'si-marquee',
        //                     color: '#99cc33',
        //                     action: $.action("webgis", "maps/layers/boxSelectStatistics", "boxSelectStatisticsInit_", [])
        //                 },
        //                 {
        //                     toolIndex: 14,
        //                     text: '观测截面',
        //                     icon: 'si-reorder',
        //                     color: '#ff9966',
        //                     action: $.action("webgis", "maps/layers/gcjmStatisticsUi", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 15,
        //                     text: '智能报警列表',
        //                     icon: 'si-attention',
        //                     color: '#01c5fe',
        //                     action: $.action("webgis", "maps/layers/ritsEvent", "buttonClick_", [])
        //                 },
        //                 {
        //                     toolIndex: 16,
        //                     text: '专题船舶',
        //                     icon: 'si-flag-checkered',
        //                     color: '#66cccc',
        //                     action: $.action("webgis", "maps/layers/specialShip", "init_", [])
        //                 },
        //                 {
        //                     toolIndex: 17,
        //                     text: '船舶数据',
        //                     icon: 'si-medium',
        //                     color: '#99cc33',
        //                     action: $.action("webgis", "weihai/zcData", "init_", [])
        //                 },
        //                 {
        //                     text: '创建任务',
        //                     icon: 'si-flag-filled',
        //                     color: '#69b3fe',
        //                     action: $.action("webgis", "weihai/creatTask", "init_", [])
        //                 },
        //             ]
        //         }
        //     ]
        // },
        // "maps/layers/shipsUi": {
        //     shiphistoryApi: 'api/shiphistory',
        //     shipVoyageApi: 'api/shipVoyage',
        //     playback: {
        //         url: "playback",
        //         target: "_blank" //page
        //     },
        //     detailIndex: 1
        // },
        // "maps/layers/plotUi": {
        //     plotInfoApi: 'api/plotInfo',
        //     toolIndex: 5,
        //     detailIndex: 2
        // },
        // "maps/layers/thhjUi": {
        //     toolIndex: 6,
        //     detailIndex: 3
        // },
        // "maps/layers/workView": {
        //     toolIndex: 7
        // },
        // "maps/layers/shipTeam": {
        //     shipTeamGroupApi: "api/shipTeam/Group",
        //     shipTeamItemApi: "api/shipTeam/Item",
        //     toolIndex: 8
        // },
        "maps/layers/berth": {
            berthApi: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/berth")
        },
        "maps/layers/cctv": {
            // cctvStaticInfoApi: 'api/cctvStaticInfo',
            cctvApi: $.format("http://${apiHostIp}:${apiHostPort}${apiRoot}/api/cctv"),
            zIndex: 4,
            zoom: 5
        },
        // "maps/layers/cctvUi": {
        //     // cctvStaticInfoApi: 'api/cctvStaticInfo',
        //     toolIndex: 9,
        //     detailIndex: 4,
        // },
        // "maps/layers/taskMembers": {
        //     tileUrl: 'api/taskMembers/tile',
        //     tileVersionUrl: 'api/taskMembers/tile',
        //     rtds: 'api/taskMembers/rtds',
        //     shiphistoryApi: "api/taskMembers/shiphistory",
        //     expires: 60 * 60 * 24 * 30,
        //     zIndex: 5,
        //     zoom: 7
        // },
        // "maps/layers/task": {
        //     taskApi: 'api/taskManager/task',
        //     recordApi: "api/taskManager/record",
        //     attachMetadataApi: "api/taskManager/attachMetadata",
        //     attachmentApi: "api/attachment",
        //     userApi: 'api/taskManager/user',
        //     taskNotificationApi: 'api/taskNotification',
        //     zIndex: 6,
        //     zoom: 9,
        // },
        // "maps/layers/taskUi": {
        //     toolIndex: 10,
        //     detailIndex: 5,
        // },
        // "maps/layers/taskMembersUi": {
        //     detailIndex: 6,
        // },
        // "ui/defaultMenu": {
        //     //defaultOpenItem: "departmentManage", //"webgisMenuLink",
        //     defaultMenuItems: [
        //         //{label:"船舶监控",href:"#index",style:{iconFont:"fa-tachometer"}},
        //         //{label:"智能报警历史查询",href:"historyRITSQuery",style:{iconFont:"fa-film"}},
        //         { label: "航迹回放", href: "playback", style: { iconFont: "si-playback", index: 0 } }
        //     ],
        //     items: [
        //         {
        //             //     "name": "playback",
        //             //     "label": "航迹回放",
        //             //     "page": "playback",
        //             //     "style": {"iconFont": "si-play", "index": 0},
        //             //     "action": $.action("playback")
        //             // }, {
        //             "name": "webgis",
        //             "label": "Webgis",
        //             "page": "webgis",
        //             "style": { "iconFont": "si-webgis", "index": 1 },
        //             "action": $.action("webgis")
        //         }, {
        //             "name": "userManage",
        //             "label": "用户管理",
        //             "page": "userManage",
        //             "style": { "iconFont": "si-user-management", "index": 2 }
        //         }, {
        //             "name": "departmentManage",
        //             "label": "部门管理",
        //             "page": "userManage/departmentManage",
        //             "style": { "iconFont": "si-department-management" },
        //             "parentName": "userManage",
        //             "action": $.action("userManage/departmentManage"),
        //             "permission": "UserManage"
        //         }, {
        //             "name": "usersManage",
        //             "label": "人员管理",
        //             "page": "userManage/usersManage",
        //             "style": { "iconFont": "si-staff-management" },
        //             "parentName": "userManage",
        //             "action": $.action("userManage/usersManage")
        //         }, {
        //             "name": "rolesManage",
        //             "label": "角色管理",
        //             "page": "userManage/rolesManage",
        //             "style": { "iconFont": "si-role-management" },
        //             "parentName": "userManage",
        //             "action": $.action("userManage/rolesManage")
        //         }, {
        //             "name": "actionsManage",
        //             "label": "权限管理",
        //             "page": "userManage/actionsManage",
        //             "style": { "iconFont": "si-permission-management" },
        //             "parentName": "userManage",
        //             "action": $.action("userManage/actionsManage")
        //         }, {
        //             "name": "menuTaskManage",
        //             "label": "任务管理",
        //             "page": "menuTaskManage",
        //             "style": { "iconFont": "si-task-management", "index": 6 }
        //         }, {
        //             "name": "menuCurrentTasks",
        //             "label": "待办任务",
        //             "page": "menuTaskManage/menuCurrentTasks",
        //             "style": { "iconFont": "si-book-open" },
        //             "parentName": "menuTaskManage",
        //             "action": $.action("menuTaskManage/menuCurrentTasks")
        //         }, {
        //             "name": "menuHistoryTasks",
        //             "label": "任务查询",
        //             "page": "menuTaskManage/menuHistoryTasks",
        //             "style": { "iconFont": "si-search" },
        //             "parentName": "menuTaskManage",
        //             "action": $.action("menuTaskManage/menuHistoryTasks")
        //         }, {
        //             "name": "menuTemplateTasks",
        //             "label": "定时任务",
        //             "page": "menuTaskManage/menuTemplateTasks",
        //             "style": { "iconFont": "si-newspaper" },
        //             "parentName": "menuTaskManage",
        //             "action": $.action("menuTaskManage/menuTemplateTasks")
        //         }, {
        //             "name": "statisticsTasks",
        //             "label": "任务统计",
        //             "page": "menuTaskManage/statisticsTasks",
        //             "style": { "iconFont": "si-pie-chart" },
        //             "parentName": "menuTaskManage",
        //             "action": $.action("menuTaskManage/statisticsTasks")
        //         }, {
        //             "name": "menuTaskResourceManage",
        //             "label": "资源管理",
        //             "page": "menuTaskResourceManage",
        //             "style": { "iconFont": "si-resource-management", "index": 7 }
        //         }, {
        //             "name": "menuEquip",
        //             "label": "设备管理",
        //             "page": "menuTaskResourceManage/menuEquip",
        //             "style": { "iconFont": "si-cog-1" },
        //             "parentName": "menuTaskResourceManage",
        //             "action": $.action("menuTaskResourceManage/menuEquip")
        //         }, {
        //             "name": "menuVehicle",
        //             "label": "车船管理",
        //             "page": "menuTaskResourceManage/menuVehicle",
        //             "style": { "iconFont": "si-cog-outline" },
        //             "parentName": "menuTaskResourceManage",
        //             "action": $.action("menuTaskResourceManage/menuVehicle")
        //         }, {
        //             "name": "menuTaskLevel",
        //             "label": "任务级别管理",
        //             "page": "menuTaskResourceManage/menuTaskLevel",
        //             "style": { "iconFont": "si-menu-outline" },
        //             "parentName": "menuTaskResourceManage",
        //             "action": $.action("menuTaskResourceManage/menuTaskLevel")
        //         }, {
        //             "name": "menuTaskType",
        //             "label": "任务类型管理",
        //             "page": "menuTaskResourceManage/menuTaskType",
        //             "style": { "iconFont": "si-menu" },
        //             "parentName": "menuTaskResourceManage",
        //             "action": $.action("menuTaskResourceManage/menuTaskType")
        //         }, {
        //             "name": "menuSeamap",
        //             "label": "海图文件管理",
        //             "page": "Seamap",
        //             "style": { "iconFont": "si-file-management" },
        //             "action": $.action("Seamap")
        //         }
        //     ]
        // },
        // "ui/playbackMenu": {
        //     defaultMenuItems: [],
        //     items: []
        // },
        // "maps/layers/anchorageEvent": {
        //     eventDealApi: 'api/eventDeal',
        //     toolIndex: 11,
        //     detailIndex: 7,
        //     zIndex: 7,
        //     zoom: 10
        // },
        // "maps/layers/anchorageEventUi": {
        //     toolIndex: 11,
        //     detailIndex: 7,
        // },
        // "maps/layers/playback": {
        //     shipsBoundsApi: 'api/ships/bounds2',
        //     shiphistoryApi: 'api/shiphistory'
        // },
        // "maps/layers/portShip": {
        //     allports2Api: 'api/allports2',
        //     toolIndex: 12
        // },
        // "maps/layers/shipArchive": {
        //     linkApi: "api/link",
        //     shipArchiveWebServiceApi: 'api/shipArchiveWebService'
        // },
        // "maps/layers/waterDepth": {
        //     waterDepthDataApi: "api/waterDepthData",
        //     tideApi: "api/tide",
        //     zIndex: 8,
        //     zoom: 6
        // },
        // "maps/layers/gcjmStatisticsUi": {
        //     sectionObserverApi: 'api/sectionObserver',
        //     recordApi: "api/record",
        //     toolIndex: 14,
        //     detailIndex: 9
        // },
        // "maps/layers/gcjmStatistics": {
        //     zIndex: 9,
        //     zoom: 9
        // },
        // "comMis/userManage": {
        //     departmentsApi: 'api/departments',
        //     normalUserApi: 'api/normalUser',
        //     roleApi: 'api/role',
        //     actionApi: 'api/action',
        //     menuIndex: 2
        // },
        // "comMis/cargoShip": {
        //     cargoShipsApi: 'api/cargoShips',
        //     berthInfoesApi: 'api/berthInfoes',
        //     passengerShipsApi: 'api/passengerShips',
        //     vesselArchiveApi: 'api/VesselArchive',
        //     menuIndex: 3
        // },
        // "comMis/passengerShip": {
        //     passengerShipsApi: 'api/passengerShips',
        //     vesselArchiveApi: 'api/VesselArchive',
        //     cargoShipsApi: 'api/cargoShips',
        //     menuIndex: 4
        // },
        // "comMis/waterWork": {
        //     waterWorksApi: 'api/waterWorks',
        //     departmentsApi: 'api/fujianDepartments',
        //     menuIndex: 5
        // },
        // "weihai/taskManagement": {
        //     departmentApi: 'api/departments',
        //     taskApi: 'api/taskManager/task',
        //     recordApi: 'api/taskManager/record',
        //     userApi: 'api/taskManager/user',
        //     vehicleApi: 'api/taskManager/vehicle',
        //     equipmentApi: 'api/taskManager/equipment',
        //     templateApi: 'api/taskManager/template',
        //     tasktypeApi: 'api/taskManager/tasktype',
        //     tasklevelApi: 'api/taskManager/tasklevel',
        //     attachMetadataApi: "api/taskManager/attachMetadata",
        //     attachmentApi: "api/attachment",
        //     statisticsApi: "api/taskManager/statistics",
        //     menuIndex: {
        //         tastManage: 6,
        //         resourceManage: 7
        //     }
        // },
        // "weihai/creatTask": {
        //     departmentApi: 'api/departments',
        //     taskApi: 'api/taskManager/task',
        //     recordApi: 'api/taskManager/record',
        //     userApi: 'api/taskManager/user',
        //     vehicleApi: 'api/taskManager/vehicle',
        //     equipmentApi: 'api/taskManager/equipment',
        //     tasktypeApi: 'api/taskManager/tasktype',
        //     tasklevelApi: 'api/taskManager/tasklevel',
        //     attachMetadataApi: "api/taskManager/attachMetadata",
        //     attachmentApi: "api/attachment",
        //     detailIndex: 10,
        //     toolIndex: 17
        // },
        // "weihai/zcData": {
        //     zdgzApi: 'api/zdgz',
        //     xccbApi: 'api/xccb',
        //     cbajApi: 'api/cbaj',
        // },
        // "comMis/VTS": {
        //     vesselDynamicApi: 'api/vesselDynamic',
        //     normalBerthApi: 'api/normalBerth',
        //     vesselOfCompanyApi: 'api/vesselOfCompany',
        //     companyApi: 'api/company',
        //     menuIndex: 8
        // },
        // "comMis/VTSMarine": {
        //     vesselDynamicApi: 'api/vesselDynamic',
        //     normalBerthApi: 'api/normalBerth',
        //     vesselOfCompanyApi: 'api/vesselOfCompany',
        //     companyApi: 'api/company',
        //     menuIndex: 9
        // },
        // "maps/layers/boxSelectStatistics": {
        //     areaAnalysisApi: 'api/areaAnalysis',
        //     toolIndex: 13
        // },
        // "maps/layers/fujianWaterWorkView": {
        //     fujianDepartmentsApi: 'api/fujianDepartments',
        //     waterWorksApi: 'api/waterWorks',
        //     toolIndex: 16,
        //     detailIndex: 11
        // },
        // "maps/layers/historyRITSQuery": {
        //     ritsEventDataApi: 'api/ritsEventData',
        //     locationApi: 'api/location',
        //     menuIndex: 10,
        //     detailIndex: 12
        // },
        // "maps/layers/ritsEvent": {
        //     ritsEventDataApi: 'api/ritsEventData',
        //     toolIndex: 15
        // },
        // "maps/layers/specialShip": {
        //     specialShipApi: 'api/specialShip/',
        //     toolIndex: 16
        // },
        // "maps/layers/fujianUserManage": {
        //     fujianDepartmentsApi: 'api/fujianDepartments',
        //     // fujianDepartmentsApi:'api/departments',
        //     fujianUsersApi: 'api/fujianUsers',
        //     menuIndex: 11
        // },
        // "maps/layers/fujianUser": {
        //     fujianUsersApi: 'api/fujianUsers',
        //     normalUserApi: 'api/normalUser'
        // },
        // "maps/layers/shipDeclaration": {
        //     cargoShipsApi: 'api/cargoShips',
        //     berthInfoesApi: 'api/berthInfoes',
        //     detailIndex: 13
        // },
        // "help": {
        //     infoIndex: -3,
        //     list: [
        //         { label: '更新记录', uri: 'http://www.baidu.com' },
        //         { label: '操作手册', uri: 'http://www.sohu.com' },
        //         { label: '关于我们', uri: 'http://www.sina.com.cn' }
        //     ]
        // },
        // "maps/ui/playbackUiFrame": {
        //     items: []
        // },
        // 'comMis/seamap': {
        //     seamapApi: 'api/seamap'
        // }
    }
});
