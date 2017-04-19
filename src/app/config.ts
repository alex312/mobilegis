// import {TaskStatus} from './task/service/metadata.service';

export const Config = {
    // proxy: "http://192.168.13.14:9006/",
    // proxy: "http://192.168.13.35:9007/",
    // proxy: "http://192.168.3.23/tjvts/",
    proxy: "http://60.30.247.211:88/",
    CORDOVA_READY: false,
    needLogin: false,

    // GeoConfig: {
    //     desiredAccuracy: 10,
    //     stationaryRadius: 20,
    //     distanceFilter: 30,
    //     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    //     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    // },
    // taskConfig: {
    //     receivedTaskStatus: [TaskStatus.PendingReceive, TaskStatus.PendingExecution, TaskStatus.BeginExecuted, TaskStatus.Completed],
    //     perBlockSize: 1024
    // },
    mapConfig: {
        webgisUrl: "wg5/index.html"
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