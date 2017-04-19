module.exports = {
    copyWG5: {
        src: ["{{ROOT}}/wg5/**/*"],
        dest: "{{WWW}}/wg5"
    },

    copyWG5NodeModel: {
        src: [
            '{{ROOT}}/node_modules/reflect-metadata/Reflect.js',
            '{{ROOT}}/node_modules/reflect-metadata/Reflect.js.map',
            '{{ROOT}}/node_modules/requirejs/require.js',
            '{{ROOT}}/node_modules/require-css/css.js',
            '{{ROOT}}/node_modules/requirejs-text/text.js',
            '{{ROOT}}/node_modules/jquery/dist/jquery.js',
            '{{ROOT}}/node_modules/openlayers/dist/ol-debug.js',
            '{{ROOT}}/node_modules/knockout/build/output/knockout-latest.debug.js',
            '{{ROOT}}/node_modules/protobufjs/dist/protobuf.js',
            '{{ROOT}}/node_modules/long/dist/long.js',
            '{{ROOT}}/node_modules/bytebuffer/dist/bytebuffer.js',
            '{{ROOT}}/node_modules/fecha/fecha.js',
            '{{ROOT}}/node_modules/font-awesome/css/font-awesome.js',
            '{{ROOT}}/node_modules/openlayers/dist/ol.css',
            '{{ROOT}}/node_modules/highcharts/highcharts.src.js',
            '{{ROOT}}/node_modules/webrtc-adapter/out/adapter.js',
            '{{ROOT}}/wg5/resources/ol-patch.css'],
        dest: "{{BUILD}}"
    },

    copyBablePolyfill: {
        src: ['{{ROOT}}/node_modules/babel-polyfill/dist/polyfill.js',],
        dest: "{{BUILD}}/bable"
    }
};