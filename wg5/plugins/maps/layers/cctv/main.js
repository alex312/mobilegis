"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "openlayers", "text!plugins/maps/layers/cctv/htmls/SidePanel.html", "text!plugins/maps/layers/cctv/htmls/ObjInfo.html", "jquery", "knockout", "../../../../seecool/plugins/Plugins", "seecool/datas/Collection", "seecool/datas/Collection", "seecool/StaticLib", "seecool/StaticLib", "./layers/CctvLayerEntity", "./datas/CctvStaticInfoApi", "./SidePanel"], function (require, exports, ol, sidePanel, objInfo, $, ko, Plugins_1, Collection_1, Collection_2, StaticLib_1, StaticLib_2, CctvLayerEntity_1, CctvStaticInfoApi_1, SidePanel_1) {
    "use strict";

    var CFG;

    var CctvPlugin = function () {
        function CctvPlugin(config, frame, detailViewer, map, setting) {
            _classCallCheck(this, CctvPlugin);

            this.cctvInfoMergeList_ = {};
            this.config_ = config;
            var con = new StaticLib_2.Config(this.config_);
            CFG = con.DefaultData.bind(con);
            this.map_ = map;
            var sideView = frame.sideView;
            this.setting_ = setting;
            this.init_();
            this.load_();
            detailViewer.registerSelectFocusEvent("cctvSelectFocus", this.featureSelected_.bind(this));
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: 'CCTV',
                icon: 'fa fa-tv',
                click: function () {
                    var panel = $(sidePanel);
                    // this.ui.ShowSidePanel("CCTV", panel);
                    var features = this.layerEntity_.Source.getFeatures();
                    features.sort(function (a, b) {
                        return a.data.Info.Name.localeCompare(b.data.Info.Name);
                    });
                    var cctvdata = features.map(function (v) {
                        return {
                            Name: v.data.Info.Name,
                            target: v,
                            cctvListClick: this.cctvListClick_.bind(this)
                        };
                    }.bind(this));
                    sideView.open(new SidePanel_1.default({
                        cctvdata: cctvdata
                    }));
                }.bind(this)
            });
        }

        _createClass(CctvPlugin, [{
            key: "init_",
            value: function init_() {
                this.dataSet_ = new Collection_2.CollectionA("dataSet");
                //this.dataDTOSet=new CollectionA<ICctvDTO>("dataDTOSet");
                this.cctvStaticInfoApi_ = new CctvStaticInfoApi_1.default(this.config_.cctvStaticInfoApi || "api/CCTVStaticInfo");
                // this.ui.RegisterMainMenu(null, "cctvMenuLink", "Cctv", this.menuClick.bind(this), {iconFont: "fa-video-camera"});
                // this.ui.RegisterSelectFocusEvent("cctvSelectFocus", this.featureSelected.bind(this));
                this.layerEntity_ = new CctvLayerEntity_1.default({});
                //this.link_DataSet_DataDTOSet=new CollectionLinker<ICctv,ICctvDTO>(CollectionLinkerOption<ICctv,ICctvDTO>(
                //    this.dataDTOSet,
                //    this.dataSet_,
                //    function(v){return true},
                //    function(v:ICctvDTO):ICctv{
                //        var t:ICctv ={
                //            Info:JSON.parse(v.Info),
                //            IsDeleted:v.IsDeleted,
                //            Key:v.Key
                //        }
                //        return t;
                //    }
                //));
                this.link_LayerEntity_DataSet_ = new Collection_1.CollectionLinker({
                    sourceCollection: this.dataSet_,
                    targetCollection: this.layerEntity_.DataSet,
                    filterFunction: function filterFunction(v) {
                        return v.IsDeleted ? false : true;
                    },
                    convertFunction: function (v) {
                        var Info = v.Info;
                        var LL = Info.Longitude > Info.Latitude ? [Info.Longitude, Info.Latitude] : [Info.Latitude, Info.Longitude];
                        LL[0] = LL[0] > 180 || LL[0] < -180 ? 0 : LL[0];
                        LL[1] = LL[1] > 90 || LL[1] < -90 ? 0 : LL[1];
                        var lonlat = ol.proj.fromLonLat(LL);
                        var geom = new ol.geom.Point(lonlat);
                        var f2 = new ol.Feature({
                            geometry: geom
                        });
                        this.featureAppand_(f2, v);
                        return f2;
                    }.bind(this)
                });
                //this.link_DataSet_DataDTOSet.start();
                this.link_LayerEntity_DataSet_.start();
                // this.status_ = new Status(this);
                // this.status_.ConditionTurn(true, "hided");//hided
                // this.switch_(null);
                this.isLayerShow_ = ko.observable(true);
                this.isLayerShow_.subscribe(function (v) {
                    this.setVisible(v);
                }.bind(this));
                var switch1 = StaticLib_1.CheckBox({
                    checked: this.isLayerShow_,
                    view: "CCTV",
                    click: this.switch_.bind(this)
                });
                this.setting_.registerSettingElement("mapSwitch", switch1);
                //this.ui.RegisterShortBarButton(null,"plotSwitch","桩位",this.switch_.bind(this)).click();
                this.map_.map.addLayer(this.layerEntity_.layer);
            }
        }, {
            key: "switch_",
            value: function switch_() {
                if (this.isLayerShow_()) {
                    this.isLayerShow_(false);
                } else {
                    this.isLayerShow_(true);
                }
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                this.layerEntity_.layer.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
            /**
             * Tree
             * @param list
             * @param str
             * @param nodefun node的构造函数
             * @constructor
             */

        }, {
            key: "listTotreeByPid",
            value: function listTotreeByPid(list, str, node) {
                //var list=arguments[1].split(',');
                var r = { root: {} };
                list.map(function (v) {
                    r[str] = v;
                });
                return r.root;
            }
        }, {
            key: "cctvListClick_",
            value: function cctvListClick_(data, evt) {
                this.map_.setFocus(data.target);
            }
        }, {
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('cctv:'))) return null;
                //var feature = this.layerEntity_.Layer.getFeatureById(featureId);
                var data = feature.data;
                if (data) {
                    var oi = $(objInfo);
                    var viewModel = {
                        Key: data.Key,
                        IsDeleted: data.IsDeleted,
                        Name: data.Info.Name,
                        Altitude: data.Info.Altitude,
                        Heading: data.Info.Heading,
                        ImageType: data.Info.ImageType,
                        Platform: data.Info.Platform,
                        ViewPort: data.Info.ViewPort,
                        Streams: data.Info.Streams,
                        playVideo: this.playVideo_.bind(this)
                    };
                    ko.applyBindings(viewModel, oi[0]);
                    oi.data("title", "CCTV信息");
                    var args = CFG("videoServerUrl", "http://192.168.9.222:27010") + "/ " + data.Key;
                    var href = "http://localhost:8234/StartProcess";
                    var form = oi.find('#cctvPlayVideo').attr('action', href);
                    $("<input type=\"text\" hidden name=\"token\" value=\"cctv\">").appendTo(form);
                    $("<input type=\"text\" hidden name=\"args\" value=\"" + args + "\">").appendTo(form);
                    return oi;
                }
                return oi;
            }
        }, {
            key: "featureAppand_",
            value: function featureAppand_(olFeature, data) {
                olFeature.id = "cctv:" + data.Key;
                olFeature.data = data;
            }
        }, {
            key: "cctvInfoMergeListUpdata_",
            value: function cctvInfoMergeListUpdata_(KV) {
                var features = this.layerEntity_.Source.getFeatures();
                var t = {};
                features.map(function (v) {
                    t[v.data.Key] = v;
                });
                for (var i in KV) {
                    var I = KV[i];
                    if (i in this.cctvInfoMergeList_) {
                        for (var j in I.Info) {
                            if (j in this.cctvInfoMergeList_[i].Info) {} else {
                                this.cctvInfoMergeList_[i].Info[j] = I.Info[j];
                            }
                        }
                        var lat = I.Info.Latitude > 90 ? this.cctvInfoMergeList_[i].Info.Latitude : I.Info.Latitude;
                        var lon = I.Info.Longitude > 180 ? this.cctvInfoMergeList_[i].Info.Longitude : I.Info.Longitude;
                        this.cctvInfoMergeList_[i].Info.Latitude = lat;
                        this.cctvInfoMergeList_[i].Info.Longitude = lon;
                        //this.dataSet_.Modify([I]);
                        //t[I.Key].data.Info.Latitude=lat;
                        //t[I.Key].data.Info.Longitude=lon;
                        this.layerEntity_.Source.removeFeature(t[I.Key]);
                        //this.layerEntity_.Source.addFeatures([t[I.Key]])
                        this.dataSet_.Add([this.cctvInfoMergeList_[i]]);
                    } else {
                        this.cctvInfoMergeList_[i] = I;
                        this.dataSet_.Add([I]);
                    }
                }
            }
        }, {
            key: "load_",
            value: function load_() {
                this.cctvStaticInfoApi_.Get_CctvDynamic$version(0).then(function (pdata) {
                    var t = {};
                    pdata.data.Items;
                    pdata.data.Items.map(function (v) {
                        t[v.Key] = v;
                        t[v.Key].Info = JSON.parse(v.Info);
                    });
                    this.cctvInfoMergeListUpdata_(t);
                }.bind(this));
                this.cctvStaticInfoApi_.Get_CctvStatic$version(0).then(function (pdata) {
                    var t = {};
                    pdata.data.Items;
                    pdata.data.Items.map(function (v) {
                        t[v.Key] = v;
                        t[v.Key].Info = JSON.parse(v.Info);
                    });
                    this.cctvInfoMergeListUpdata_(t);
                }.bind(this));
                //this.cctvStaticInfoApi_.Get_CctvPosition$version(0)
                //.then(function(pdata:pdata){
                //    var t={};
                //    <ICctvDTO>pdata.data.Items
                //    pdata.data.Items.map(function(v){
                //        t[v.Key]=v;
                //        t[v.Key].Info=JSON.parse(v.Info);
                //    })
                //    this.cctvInfoMergeListUpdata_(t);
                //}.bind(this))
                //
                //this.cctvStaticInfoApi_.Get_CctvHierarchy$$default$version(0)
                //.then(function(pdata:pdata){
                //    var t={};
                //    <ICctvDTO>pdata.data.Items
                //    pdata.data.Items.map(function(v){
                //        t[v.Key]=v;
                //        t[v.Key].Info=JSON.parse(v.Info);
                //    })
                //    this.cctvInfoMergeListUpdata_(t);
                //}.bind(this))
                //Promise.all([
                //    this.cctvStaticInfoApi_.Get_CctvDynamic$version(0),
                //    this.cctvStaticInfoApi_.Get_CctvStatic$version(0),
                //    this.cctvStaticInfoApi_.Get_CctvPosition$version(0),
                //    this.cctvStaticInfoApi_.Get_CctvHierarchy$$default$version(0)
                //])
                //.then(function(all){
                //    this.cctvDynamic=all[0];
                //    this.cctvStatic=all[1];
                //    this.cctvPosition=all[2];
                //    this.cctvHierarchy=all[3];
                //    all.map(function(v){
                //        v.data.Items.map(function(vv){
                //            vv.Info=JSON.parse(vv.Info);
                //            this.cctvInfoMergeList_[vv.Key]=priorConfig(this.cctvInfoMergeList_[vv.Key],vv);
                //        }.bind(this))
                //    }.bind(this))
                //    var t=[];
                //    for(var i in this.cctvInfoMergeList_){t.push(this.cctvInfoMergeList_[i])};
                //
                //    return new Promise(function(resolve,reject){
                //        //switch(pdata.state){
                //        //    case "apiok":
                //                //<ICctvStaticInfo>(pdata.data);
                //        var cctvs = t.filter(function (v) {
                //            return (v.Info.Type == 2);
                //        });
                //        //this.dataDTOSet.Add(cctvs);
                //        this.dataSet_.Add(cctvs);
                //        resolve();
                //        //        break;
                //        //    default:
                //        //        reject()
                //        //}
                //    }.bind(this))
                //}.bind(this))
                //.catch(function(pdata:pdata){
                //    switch(pdata.state){
                //        case "apierr":
                //            break;
                //    }
                //    if(!pdata.state)throw(pdata);
                //})
            }
            //
            //playVideo(data,evt){
            //    evt.target.form.submit();
            //    return false;
            //}

        }, {
            key: "playVideo_",
            value: function playVideo_(data, evt) {
                var args = CFG("videoServerUrl", "http://192.168.9.222:27010") + "/ " + data.Key; //CCTV1_50BAD15900030304";
                $.ajax({
                    url: "http://localhost:8234/StartProcess?token=cctv&args=" + args,
                    type: 'get',
                    dataType: 'jsonp'
                }).done(function (evt) {
                    //alert("已发起播放请求");
                }).fail(function (evt) {
                    //alert("播放失败,你的设备可能没有安装相应服务");
                });
            }
        }, {
            key: "playVideoByUrl_",
            value: function playVideoByUrl_(data, evt) {
                //var args = data.Url;
                var args = "http://192.168.9.222:27010/%20CCTV1_50BAD15900030304";
                $.ajax({
                    url: "http://localhost:8234/StartProcess?token=cctv&args=" + args,
                    type: 'get'
                }).done(function () {}).fail(function () {
                    alert("播放失败,你的设备可能没有安装相应服务");
                });
            }
        }]);

        return CctvPlugin;
    }();

    CctvPlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame')), __param(2, Plugins_1.inject("maps/ui/detailViewer")), __param(3, Plugins_1.inject("maps/map")), __param(4, Plugins_1.inject("maps/tools/setting"))], CctvPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CctvPlugin;
});