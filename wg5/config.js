define({
    pages: {
        "index": [
            'ui/frame,maps/iMapFrame:ui/mobileFrame',
            'maps/map',
            'maps/layers/ships',
            'maps/layers/berth',
            'maps/layers/plot',
            'maps/layers/thhj'
        ]
    },
    plugins: {
        "maps/map": {
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
                            url: "http://192.168.13.35:9007/wg5/MapService?service=wmts&request=gettile&tilematrixset=advsea&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/png&layer=default&style=default&version=1.0.0"
                        }
                    },
                    {
                        default: true,
                        title: '基础海图+路图',
                        provider: 'ol.source.XYZ',
                        options: {
                            url: "http://192.168.13.35:9007/wg5/MapService?service=wmts&request=gettile&tilematrixset=basicsearoad&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/png&layer=default&style=default&version=1.0.0"
                        }
                    }
                ]
            }
        },
        "maps/layers/ships": {
            tileUrl: 'http://192.168.13.35:9007/wg5/api/shipstile2',
            tileVersionUrl: 'http://192.168.13.35:9007/wg5/api/shipstile2',
            rtds: 'ws://192.168.13.35:9007/wg5/api/rtds',
            expires: 60 * 60 * 3,
            shiphistoryApi: 'http://192.168.13.35:9007/wg5/api/shiphistory'
        },
        "maps/layers/berth": {
            berthApi: 'http://192.168.13.35:9007/wg5/api/berth'
        },
        "maps/layers/plot": {
            plotInfoApi: 'http://192.168.13.35:9007/wg5/api/PlotInfo'
        },
        "maps/layers/thhj": {
            locationApi: 'http://192.168.13.35:9007/wg5/api/location',
            defaultTrafficEnvStyleApi: "http://192.168.13.35:9007/wg5/api/DefaultTrafficEnvStyle"
        }
    }
});
