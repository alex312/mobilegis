
declare var appConfig;

export const Config = {
    proxy: `http://${appConfig.apiHostIp}:${appConfig.apiHostPort}${appConfig.app.apiRoot}`,
    // proxy: "",
    CORDOVA_READY: false,
    needLogin: false,

    // GeoConfig: {
    //     desiredAccuracy: 10,
    //     stationaryRadius: 20,
    //     distanceFilter: 30,
    //     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    //     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    // },
    mapConfig: {
        webgisUrl: "wg5/index.html"
    },
    taskConfig: {
        receivedTaskStatus: ["PendingReceive", "PendingExecution", "BeginExecuted", "Completed"],
        perBlockSize: 100 * 1024
    },
    Plugins: {
        article: {
            webapi: {
                articleItems: "api/articles/items",
                warning: "api/warnings",
                elegant: "api/elegant",
                weather: "api/weather"
            }
        },
        cctv: {
            webapi: {
                hierarchy: `api/StaticInfo/CCTVHierarchy.default?version=`,
                playParam: `api/MediaAddress/GetUrl/`
            }
        },
        location: {
            background_geo_config: {
                debug: false,
                desiredAccuracy: 10,
                stationaryRadius: 0,
                distanceFilter: 0,
                maxLocations: 1000,
                stopOnTerminate: false,
                locationProvider: 0,
                interval: 1 * 1000,
                notificationTitle: '位置跟踪',
                notificationText: '开启',
                activityType: "AutomotiveNavigation",
            },
            geo_option: {
                timeout: 3 * 1000,
                enableHighAccuracy: true
            },
            webapi: {
                storage: "api/Location"
            }
        },
        alarm: {
            day: 1,
            groups: [
                { Type: 0, Name: '超速报警', Alarms: [], Hidden: false },
                { Type: 8, Name: '越界预警', Alarms: [], Hidden: true },
                { Type: 9, Name: '避碰预警', Alarms: [], Hidden: true },
                { Type: 13, Name: '速度异常', Alarms: [], Hidden: true },
            ],
            webapi: {
                alarm: 'VTSWebServiceV5/api/RITSEventData',
                cable: 'VTSWebServiceV5/api/Cable'
            }
        },
        Search: {
            SearchUrl: 'api/search'
        },
        Ship: {
            LinkUrl: 'wg5/LinkService/api/link',
            ArchiveUrl: 'wg5/ShipArchiveWebService/api/ShipArchive',
            VesselGroupUrl: 'VTSWebServiceV5/api/VesselGroup',
            SnapshotUrl: 'ShipHistory/api/Snapshot'
        },
        TrafficEnv: {
            LocationUrl: 'VTSWebServiceV5/api/Location'
        },
        SectionObserver: {
            SectionObserverUrl: 'VTSWebServiceV5/api/SectionObserver',
            RecordUrl: 'SectionObserver/api/Record'
        },
        QDH: {
            ShipInfo: 'QDHGPSShipService/api/ShipInfo'
        }
    }
}