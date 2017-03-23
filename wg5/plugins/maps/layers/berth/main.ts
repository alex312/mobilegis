import * as ol from "openlayers";

import {inject} from "seecool/plugins/plugins";
import {pdata} from "seecool/Interface";

import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {CollectionLinkerOption} from "seecool/datas/Collection";
import {IBerth} from "seecool/Interface";
import {IBerthDTO} from "seecool/Interface";
import {IDCFeature} from "seecool/Interface";
import {Status} from "seecool/utils/Status";

import BerthApi from "./datas/BerthApi";
import BerthLayerEntity from "./layers/BerthLayerEntity";

class Plugin {
    config_;
    //ui_;
    layerEntity_: BerthLayerEntity;
    dataSet_: CollectionA<IBerth>;
    dataDTOSet_: CollectionA<IBerthDTO>
    link_DataSet_DataDTOSet_: CollectionLinker<IBerth,IBerthDTO>;
    link_LayerEntity_DataSet_: CollectionLinker<IDCFeature,IBerth>;
    berthApi_;
    map_;
    status_;

    constructor(config,
                //@inject("webgisUI") ui, //"mainUI"
                @inject("maps/map") map) {
        this.config_ = config;
        //this.ui_=ui;
        this.map_ = map;
        this.init_();
        this.load_();
    }

    init_() {
        this.dataSet_ = new CollectionA<IBerth>("dataSet");
        this.dataDTOSet_ = new CollectionA<IBerthDTO>("dataDTOSet");
        this.berthApi_ = new BerthApi(this.config_.berthApi || "api/berth");
        this.layerEntity_ = new BerthLayerEntity({});
        this.link_DataSet_DataDTOSet_ = new CollectionLinker<IBerth,IBerthDTO>(CollectionLinkerOption<IBerth,IBerthDTO>(
            this.dataDTOSet_,
            this.dataSet_,
            function (v) {
                return true
            },
            function (v: IBerthDTO) {
                return {
                    Name: v.Code,
                    Lon: v.Lon,
                    Lat: v.Lat
                }
            }
        ));
        this.link_LayerEntity_DataSet_ = new CollectionLinker<IDCFeature,IBerth>({
            sourceCollection: this.dataSet_,
            targetCollection: this.layerEntity_.DataSet,
            filterFunction: function (v) {
                return true
            },
            convertFunction: function (v: IBerth) {
                var LL = (v.Lon > v.Lat) ? [v.Lon, v.Lat] : [v.Lat, v.Lon];
                var lonlat = ol.proj.fromLonLat(LL);
                var geom = new ol.geom.Point(lonlat);
                var f2 = new ol.Feature({
                    geometry: geom
                });
                this.featureAppand_(f2, v);
                return f2;
            }.bind(this)
        })
        this.link_DataSet_DataDTOSet_.start();
        this.link_LayerEntity_DataSet_.start();

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "hided");//hided
        this.switch_(null);
        //this.ui__.RegisterShortBarButton(null,"plotSwitch","桩位",this.Switch.bind(this)).click();
        this.map_.map.addLayer(this.layerEntity_.layer);
    }

    switch_(evt) {
        this.status_
            .IfTurnDo("hided", "displayed", function () {
                this.layerEntity_.layer.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerEntity_.layer.setVisible(false);
                //this.map_.map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
    }

    featureAppand_(olFeature, data) {
        olFeature.data = data;
        olFeature.id = "berth:" + data.Name;
    }

    load_() {
        this.berthApi_.Get_GetAllPiles()
            .then(function (pdata: pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(<Array<IBerthDTO>>pdata.data)
                            resolve();
                            break;
                        default:
                            reject()
                    }
                }.bind(this))
            }.bind(this))
            .catch(function (pdata: pdata) {
                switch (pdata.state) {
                    case "apierr":
                        break;
                }
                if (!pdata.state)throw(pdata);
            })
    }
}

export default Plugin