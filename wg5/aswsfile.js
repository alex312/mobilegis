module.exports = function (argv) {
    return {
        $includes: ['aswsfile-local'],
        babel: [
            /^\/loading\//,
            /^\/seecool\//,
            /^\/plugins\//
        ],
        proxies: {
            '/api/ships/rtds': 'ws://192.168.9.171:8898/rtds',
            '/api/ships/tile': 'http://192.168.9.171:8888/shipTile/tile',
            '/api/berth': 'http://192.168.13.15:8089/api/Berth',
            '/api/plotInfo': 'http://192.168.9.171:8888/vtswebservicev5/api/PlotInfo',
            '/api/location': 'http://192.168.9.171:8888/VTSWebServiceV5/api/Location',
            '/api/defaultTrafficEnvStyle': 'http://192.168.9.171:8888/VTSWebServiceV5/api/DefaultTrafficEnvStyle',
            '/api/shiphistory': 'http://192.168.9.171:8888/RealTimeShipHistory/api',
            '/api/WaterDepthData': 'http://192.168.13.15:8089/api/WaterDepthData',
            '/api/Tide': 'http://192.168.13.15:8089/api/Tide',
            '/api/CCTVStaticInfo': 'http://192.168.9.222:27010/api/StaticInfo',
            '/api/EventDeal': 'http://192.168.14.120:8888/ZhouShanGISWebService/api/EventDeal',
            '/api/RITSEventData':'http://192.168.14.120:8888/VTSWebServiceV5/api/RITSEventData',
            '/api': `http://${argv.api || '127.0.0.1:8080'}/api`
        },
        port: parseInt(argv.port) || 8881
    }
};