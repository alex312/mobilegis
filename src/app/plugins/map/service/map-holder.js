"use strict";
var MapHolder = (function () {
    function MapHolder() {
        this.holder = null;
    }
    MapHolder.prototype.createHolder = function () {
        if (this.holder)
            return;
        var showWebGis = window["scmap"];
        this.holder = showWebGis.then(function (mapfactory) {
            var div = document.createElement('div');
            div.style.height = "100%";
            var factory = mapfactory(div);
            var container = document.createElement('div');
            container.appendChild(div);
            document.body.appendChild(container);
            container.style.marginTop = "-100px";
            container.style.marginLeft = "-100px";
            container.style.width = '50px';
            container.style.height = "50px";
            container.style.overflow = "hidden";
            return factory.create().then(function () {
                var tool = factory.getApi();
                tool.bind("selectedFeatureChange", this.onSelecteedFeatureChange.bind(this));
                return {
                    mapContainer: container,
                    tool: tool,
                };
            }.bind(this));
        }.bind(this));
    };
    MapHolder.prototype.registSelectFeatureAction = function (key, fun) {
        if (!this.selectFeatureActions)
            this.selectFeatureActions = {};
        this.selectFeatureActions[key] = fun;
    };
    // get selectFeatureActions() {
    //     return this._selectFeatureActions;
    // }
    // set selectFeatureActions(value) {
    //     this._selectFeatureActions = value;
    // }
    MapHolder.prototype.onSelecteedFeatureChange = function (env, data) {
        for (var action in this.selectFeatureActions) {
            this.selectFeatureActions[action](env, data);
        }
    };
    return MapHolder;
}());
exports.MapHolder = MapHolder;
exports.MapHolderImp = new MapHolder();
