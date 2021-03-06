var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "openlayers", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/utils/Status", "./datas/BerthApi", "./layers/BerthLayerEntity"], function (require, exports, ol, Plugins_1, Collection_1, Collection_2, Collection_3, Status_1, BerthApi_1, BerthLayerEntity_1) {
    "use strict";
    var Plugin = (function () {
        function Plugin(config, 
            //@inject("webgisUI") ui, //"mainUI"
            map) {
            this.config_ = config;
            //this.ui_=ui;
            this.map_ = map;
            this.init_();
            this.load_();
        }
        Plugin.prototype.init_ = function () {
            this.dataSet_ = new Collection_2.CollectionA("dataSet");
            this.dataDTOSet_ = new Collection_2.CollectionA("dataDTOSet");
            this.berthApi_ = new BerthApi_1.default(this.config_.berthApi || "api/berth");
            this.layerEntity_ = new BerthLayerEntity_1.default({});
            this.link_DataSet_DataDTOSet_ = new Collection_1.CollectionLinker(Collection_3.CollectionLinkerOption(this.dataDTOSet_, this.dataSet_, function (v) {
                return true;
            }, function (v) {
                return {
                    Name: v.Code,
                    Lon: v.Lon,
                    Lat: v.Lat
                };
            }));
            this.link_LayerEntity_DataSet_ = new Collection_1.CollectionLinker({
                sourceCollection: this.dataSet_,
                targetCollection: this.layerEntity_.DataSet,
                filterFunction: function (v) {
                    return true;
                },
                convertFunction: function (v) {
                    var LL = (v.Lon > v.Lat) ? [v.Lon, v.Lat] : [v.Lat, v.Lon];
                    var lonlat = ol.proj.fromLonLat(LL);
                    var geom = new ol.geom.Point(lonlat);
                    var f2 = new ol.Feature({
                        geometry: geom
                    });
                    this.featureAppand_(f2, v);
                    return f2;
                }.bind(this)
            });
            this.link_DataSet_DataDTOSet_.start();
            this.link_LayerEntity_DataSet_.start();
            this.status_ = new Status_1.Status(this);
            this.status_.ConditionTurn(true, "hided"); //hided
            this.switch_(null);
            //this.ui__.RegisterShortBarButton(null,"plotSwitch","桩位",this.Switch.bind(this)).click();
            this.map_.map.addLayer(this.layerEntity_.layer);
        };
        Plugin.prototype.switch_ = function (evt) {
            this.status_
                .IfTurnDo("hided", "displayed", function () {
                this.layerEntity_.layer.setVisible(true);
                if (evt && evt.currentTarget)
                    evt.currentTarget.className = "btn btn-success";
            })
                .IfTurnDo("displayed", "hided", function () {
                this.layerEntity_.layer.setVisible(false);
                //this.map_.map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)
                    evt.currentTarget.className = "btn btn-danger";
            })
                .Turned();
        };
        Plugin.prototype.featureAppand_ = function (olFeature, data) {
            olFeature.data = data;
            olFeature.id = "berth:" + data.Name;
        };
        Plugin.prototype.load_ = function () {
            this.berthApi_.Get_GetAllPiles()
                .then(function (pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(pdata.data);
                            resolve();
                            break;
                        default:
                            reject();
                    }
                }.bind(this));
            }.bind(this))
                .catch(function (pdata) {
                switch (pdata.state) {
                    case "apierr":
                        break;
                }
                if (!pdata.state)
                    throw (pdata);
            });
        };
        return Plugin;
    }());
    Plugin = __decorate([
        __param(1, Plugins_1.inject("maps/map"))
    ], Plugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Plugin;
});
