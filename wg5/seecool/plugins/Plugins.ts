export function inject(name):ParameterDecorator {
    return function (target:Object, propertyKey:string | symbol, parameterIndex:number) {
        let dependencies = Reflect.getMetadata('sc-plugin-dependency', target, void(0));
        if (dependencies)
            dependencies[parameterIndex] = name;
        else {
            dependencies = [];
            dependencies[parameterIndex] = name;
            Reflect.defineMetadata('sc-plugin-dependency', dependencies, target, void(0));
        }
    };
}

var plugins = new Map<string, Promise<any>>();

export class Plugins {

    static add(name, value) {
        plugins.set(name, Promise.resolve(value));
    }

    static async load(list:string[], configs:any) {
        var mappings = new Map<string, string>(list.map(parsePluginName));
        var aliases = Array.from(mappings.keys());
        var allPlugins = new Map<string, Promise<{new(...args)}>>();
        await this.collectRequiredPlugins_(mappings, allPlugins, aliases);

        return await this.createPlugins_(aliases, configs, mappings, allPlugins);
    }

    static createPlugins_(aliases:string[], configs:any, mappings:Map<string, string>, allPlugins:Map<string, Promise<{new(...args)}>>) {
        return Promise.all(aliases.map((alias) => {
            if (!alias)
                return Promise.resolve(null);
            if(alias[alias.length - 1] === '?')
                alias = alias.substr(0, alias.length - 1);

            if (plugins.has(alias))
                return plugins.get(alias);

            var type = mappings.has(alias) ? mappings.get(alias) : alias;

            if(!allPlugins.has(type))
                return Promise.resolve(null);

            var promise = allPlugins.get(type)
                .then((cstr) => {
                    if (!cstr)
                        return Promise.resolve(null);

                    var dependencyAliases = Reflect.getMetadata('sc-plugin-dependency', cstr, void(0));
                    return this.createPlugins_(dependencyAliases || [], configs, mappings, allPlugins).then(function (deps) {
                        deps[0] = configs && configs[alias] || {};
                        return new cstr(...deps);
                    });
                });
            plugins.set(alias, promise);
            return promise;
        }));
    }

    static async collectRequiredPlugins_(mappings:Map<string, string>, result:Map<string, Promise<{new(...args)}>>, aliases) {
        await Promise.all(aliases.map((alias) => {
            if (!plugins.has(alias)) {
                var type = mappings.has(alias) ? mappings.get(alias) : alias;
                if (!result.has(type)) {
                    result.set(type, this.loadPlugin_(type)
                        .then(([cstr, dependencyAliases]) => {
                            return this.collectRequiredPlugins_(mappings, result, dependencyAliases)
                                .then(function () {
                                    return cstr;
                                })
                        }));
                }
            }
        }));
    }

    private static async loadPlugin_(type) {
        var esm = await importModule(mapTypeNameToModuleName(type));
        var cstr = esm['default'];
        var dependencyAliases = Reflect.getMetadata('sc-plugin-dependency', cstr, void(0));
        var requiredDependencyAliases = [];
        if (dependencyAliases) {
            for (var n of dependencyAliases) {
                if (n && n[n.length - 1] !== '?')
                    requiredDependencyAliases.push(n);
            }
        }
        return [cstr, requiredDependencyAliases];
    }
}

function mapTypeNameToModuleName(typeName) {
    return 'plugins/' + typeName + '/main';
}

function parsePluginName(name:string):[string,string] {
    if (name.indexOf(":") > 0)
        return <[string, string]>name.split(":");
    return [name, name];
}

function importModule(name) {
    return new Promise(function (resolve) {
        require([name], resolve);
    });
}

export default Plugins;
