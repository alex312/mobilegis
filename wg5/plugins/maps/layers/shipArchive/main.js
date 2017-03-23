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
define(["require", "exports", "jquery", "text!./htmls/ShipArchiveInfo.html", "knockout", "../../../../seecool/plugins/Plugins", "kendo"], function (require, exports, $, shipArchive, ko, Plugins_1) {
    "use strict";

    var ShipArchivePlugin = function () {
        function ShipArchivePlugin(config, detailViewer) {
            _classCallCheck(this, ShipArchivePlugin);

            this.config_ = config;
            //this.shipLayerPlugin_=shipLayerPlugin;
            detailViewer.registerSelectFocusEvent("shipArchive", this.featureSelected_.bind(this));
        }

        _createClass(ShipArchivePlugin, [{
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('shipLayer:'))) return null;
                return new Promise(function (resolve, reject) {
                    //var feature = this.shipLayerPlugin.layerShips_.getShipFeature(featureId);
                    //var shipId = feature.data.id;
                    var shipId = featureId.replace('shipLayer:', ''); //feature.data.id;
                    Promise.resolve("SCUNION.." + shipId) //"AISTELE123..413445560"
                    .then(this.queryArchiveId.bind(this)).then(this.queryArchive.bind(this)).then(this.displayArchive.bind(this)).then(function (pdata) {
                        this.infoDiv = $(shipArchive);
                        this.viewModel = {
                            data: ko.observable()
                        };
                        ko.applyBindings(this.viewModel, this.infoDiv[0]);
                        this.infoDiv.data("title", "船舶档案");
                        resolve(this.infoDiv);
                        this.viewModel.data(pdata.data);
                    }.bind(this)).catch(function (pdata) {
                        switch (pdata.state) {
                            case 'err':
                                console.log(pdata.data);
                                break;
                            case 'apierr':
                                throw pdata.data;
                        }
                        if (!pdata.state) throw pdata;
                    }.bind(this));
                }.bind(this));
            }
            //public ShowShipArchive(event) {
            //    var shipId = $(this).attr("objId");
            //    var objId=event.target.attributes["objId"].value;
            //    var feature = this.shipLayerPlugin.layerShips_.getShipFeature(objId);
            //    var id=feature.data.id;
            //    Promise.resolve("ScUnion.."+id) //"AISTELE123..413445560"
            //        .then(this.queryArchiveId)
            //        .then(this.queryArchive)
            //        .then(
            //            this.displayArchive.bind(this)
            //        ).catch(function(evt){
            //            console.log(evt);
            //        });
            //}

        }, {
            key: "queryArchiveId",
            value: function queryArchiveId(shipId) {
                var linkApi = this.config_.linkApi || "api/link";
                return new Promise(function (resolve, reject) {
                    var data = { signalIds: shipId };
                    $.ajax({
                        url: linkApi,
                        type: "get",
                        data: data
                    }).done(function (data) {
                        if (data[0].archiveId) {
                            resolve({ state: 'ok', data: data[0].archiveId });
                        } else {
                            reject({ state: 'err', data: "no find archiveId" });
                        }
                    }.bind(this)).fail(function (err) {
                        reject({ state: 'apierr', data: err });
                        console.log(err);
                    }.bind(this));
                });
            }
        }, {
            key: "queryArchive",
            value: function queryArchive(pdata) {
                var archvieId = pdata.data;
                var shipArchiveWebServiceApi = this.config_.shipArchiveWebServiceApi || 'api/ShipArchiveWebService';
                return new Promise(function (resolve, reject) {
                    var data = { shipId: archvieId };
                    $.ajax({
                        url: shipArchiveWebServiceApi + "/ShipArchiveWebService.asmx/ReadArchiveByShipId",
                        type: "post",
                        data: data
                    }).done(function (data) {
                        resolve({ state: 'apiok', data: data });
                    }.bind(this)).fail(function (err) {
                        reject({ state: 'apierr', data: err });
                        //console.log(err);
                    }.bind(this));
                });
            }
        }, {
            key: "displayArchive",
            value: function displayArchive(pdata) {
                var doc = pdata.data;
                // tryRead(X,'a.b.c')
                //var some=tryRead(info,'ShipTypeCode.#text')
                var tryRead = function tryRead(obj, path) {
                    path = path || "";
                    var paths = path.split(".");
                    var t = obj;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var i = _step.value;

                            if (i == "") continue;
                            if (t[i] == undefined || t[i] == null) return null;else {
                                t = t[i];
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return t;
                };
                var info = this.xmlToJson(doc);
                info = info.ShipArchive;
                var data = {
                    BM: tryRead(info, 'BM.#text'),
                    BuildDate: tryRead(info, 'BuildDate.#text'),
                    Callsign: tryRead(info, 'Callsign.#text'),
                    Cardbook: tryRead(info, 'Cardbook.#text'),
                    Carport: tryRead(info, 'Carport.#text'),
                    ClassificationCode: tryRead(info, 'ClassificationCode.#text'),
                    DWT: tryRead(info, 'DWT.#text'),
                    DataSource: tryRead(info, 'DataSource.#text'),
                    Decks: tryRead(info, 'Decks.#text'),
                    Depth: tryRead(info, 'Depth.#text'),
                    Draught: tryRead(info, 'Draught.#text'),
                    FlagCode: tryRead(info, 'FlagCode.#text'),
                    Gross: tryRead(info, 'Gross.#text'),
                    Height: tryRead(info, 'Height.#text'),
                    ICNO: tryRead(info, 'ICNO.#text'),
                    ID: tryRead(info, 'ID.#text'),
                    IMONO: tryRead(info, 'IMONO.#text'),
                    InitialRegistrationNO: tryRead(info, 'InitialRegistrationNO.#text'),
                    InlandShipMark: tryRead(info, 'InlandShipMark.#text'),
                    LBP: tryRead(info, 'LBP.#text'),
                    LOA: tryRead(info, 'LOA.#text'),
                    LastUpdateTime: tryRead(info, 'LastUpdateTime.#text'),
                    LocalName: tryRead(info, 'LocalName.#text'),
                    MaxSpeed: tryRead(info, 'MaxSpeed.#text'),
                    MaxSurvivalEquipmentNO: tryRead(info, 'MaxSurvivalEquipmentNO.#text'),
                    MinFreeboard: tryRead(info, 'MinFreeboard.#text'),
                    MinSafeManningNO: tryRead(info, 'MinSafeManningNO.#text'),
                    Net: tryRead(info, 'Net.#text'),
                    Operator: tryRead(info, 'Operator.#text'),
                    Owner: tryRead(info, 'Owner.#text'),
                    PassengerSpaces: tryRead(info, 'PassengerSpaces.#text'),
                    Power: tryRead(info, 'Power.#text'),
                    PowerItinerary: tryRead(info, 'PowerItinerary.#text'),
                    PowerNO: tryRead(info, 'PowerNO.#text'),
                    PropellerType: tryRead(info, 'PropellerType.#text'),
                    RPM: tryRead(info, 'RPM.#text'),
                    RegistrationPort: tryRead(info, 'RegistrationPort.#text'),
                    ShipID: tryRead(info, 'ShipID.#text'),
                    ShipNO: tryRead(info, 'ShipNO.#text'),
                    ShipNameEn: tryRead(info, 'ShipNameEn.#text'),
                    ShipSurveyNO: tryRead(info, 'ShipSurveyNO.#text'),
                    ShipTypeCode: tryRead(info, 'ShipTypeCode.#text'),
                    Shipyard: tryRead(info, 'Shipyard.#text'),
                    Slot: tryRead(info, 'Slot.#text'),
                    WindLoading: tryRead(info, 'WindLoading.#text')
                };
                return { state: 'ok', data: data };
            }
        }, {
            key: "xmlToJson",
            value: function xmlToJson(xml) {
                var obj = {};
                if (xml.nodeType == 1) {
                    if (xml.attributes.length > 0) {
                        obj["$attr"] = {};
                        for (var j = 0; j < xml.attributes.length; j++) {
                            var attribute = xml.attributes.item(j);
                            obj["$attr"][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (xml.nodeType == 3 || xml.nodeType == 4) {
                    obj = xml.nodeValue;
                }
                if (xml.hasChildNodes()) {
                    for (var i = 0; i < xml.childNodes.length; i++) {
                        var item = xml.childNodes.item(i);
                        var nodeName = item.nodeName;
                        if (typeof obj[nodeName] == "undefined") {
                            if (typeof item.nodeValue === "string") {
                                item.nodeType === 4 && (nodeName = "$cdata");
                                item.nodeValue.replace(/\s/g, "") !== "" && (obj[nodeName] = this.xmlToJson(item));
                            } else {
                                obj[nodeName] = this.xmlToJson(item);
                            }
                        } else {
                            if (typeof obj[nodeName].length == "undefined") {
                                var old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName] instanceof Array && obj[nodeName].push(this.xmlToJson(item));
                        }
                    }
                }
                return obj;
            }
        }]);

        return ShipArchivePlugin;
    }();

    ShipArchivePlugin = __decorate([__param(1, Plugins_1.inject("maps/ui/detailViewer"))], ShipArchivePlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipArchivePlugin;
});