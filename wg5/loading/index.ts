import { parse as parseConfig } from 'seecool/configuration/ConfigParser';
import { Plugins } from "seecool/plugins/Plugins";

export async function main(domRoot, basePath) {
    basePath = basePath.replace(/\/$/, '');
    var configName = basePath + '/config' + (location.search.replace(/^\?/, '-') || '');
    var config = parseConfig(await loadConfigs(configName));

    var hash = location.hash.replace(/^#/, '');
    var parts = /^([^?]*)(\?.*)?$/.exec(hash);
    var pageName = parts[1] || 'index';
    var pageParams = (parts[2] || '?').substr(1).split('&');

    applyParamsToConfig(config, pageParams);

    define('config', [], config);

    var plugins = (config.pages || {})[pageName];
    if (!plugins)
        throw new Error(`Undefined page name '${pageName}'.`);
    if (!Array.isArray(plugins) || !plugins.length)
        throw new Error(`Invalid configuration for page '${pageName}'.`);

    Plugins.add('dom/root', domRoot);

    await Plugins.load(plugins, config.plugins);
}

function applyParamsToConfig(config, params) {
    // TODO: allow patch configuration via url
    return config;
}

async function loadConfigs(configName) {
    var config = await loadConfig(configName);
    var parent = config['$extends'];
    if (!parent)
        return [config];

    parent = configName.replace(/\/.*$/, '/') + parent;

    var baseConfigs = await loadConfigs(parent);
    baseConfigs.push(config);
    return baseConfigs;
}

function loadConfig(file) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var script = "(function(define, $expr) {return " + xhr.responseText + "})";
                var configFactory = window['eval'](script);
                var config = configFactory(function () {
                    return arguments[0];
                });
                resolve(config);
            } else {
                reject({ status: xhr.status });
            }
        };
        xhr.onerror = function () {
            reject({ status: 0 });
        };
        xhr.open("GET", file + ".js", true);
        xhr.send();
    });
}

export default main;
