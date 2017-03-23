import * as $ from "jquery";

export function parse(configs) {
    console.log(configs);
    var list = {};
    var cache = {};
    var args = configs.slice();
    args.unshift(true, {});
    var config = $.extend.apply($, args);

    process(config, "_");
    resolveAll();
    for (var path in cache) {
        if (cache.hasOwnProperty(path)) {
            var parts = path.split('.');
            var v = config, i = 1, n = parts.length - 1;
            for (; i < n; i++) v = v[parts[i]];
            v[parts[n]] = cache[path];
        }
    }

    function resolve(path) {
        if (path in cache) {
            return cache[path];
        } else {
            if (path in list) {
                var value = list[path];
                if (typeof(value) === "string")
                    value = value.replace(/@\x3C([^\>]+)\>/g, function (m, m1) {
                        // \x3C = < to avoid some ridiculous bug of Webstorm
                        return resolve("_." + m1);
                    });
                cache[path] = value;
                return value;
            } else {
                throw new Error('Invalid placeholder "@{' + path + '}" in config.');
            }
        }
    }

    function resolveAll() {
        for (var path in list) {
            if (list.hasOwnProperty(path))
                resolve(path);
        }
    }

    function process(v, path) {
        if (v === null || v === undefined)
            list[path] = null;
        else if (typeof v === "string")
            list[path] = v;
        else if (v.constructor && v.constructor === Object)
            for (var each in v) {
                if (v.hasOwnProperty(each))
                    process(v[each], path + "." + each);
            }
        else if (v instanceof Array)
            for (var i = 0; i < v.length; i++)
                process(v[i], path + "." + i);
        else
            list[path] = v;
    }

    return config;
}

export default parse;
