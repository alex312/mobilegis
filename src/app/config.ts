
import { TaskStatus } from './plugins/task';

declare var appConfig;

export const Config = {
    proxy: `http://${appConfig.apiHostIp}:${appConfig.apiHostPort}${appConfig.app.apiRoot}`,
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
        Alarm: {
            AlarmUrl: 'VTSWebServiceV5/api/RITSEventData',
            CableUrl: 'VTSWebServiceV5/api/Cable'
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