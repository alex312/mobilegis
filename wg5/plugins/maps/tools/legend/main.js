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
define(["require", "exports", "jquery", "text!./htmls/Legend.html", "../../../../seecool/plugins/Plugins", "kendo", "jquery-ui", "css!./style.css"], function (require, exports, $, legendDiv, Plugins_1) {
    "use strict";

    var LegendPlugin = function () {
        function LegendPlugin(config, frame) {
            _classCallCheck(this, LegendPlugin);

            this.legendList_ = [];
            this.isLegendInited_ = false;
            this.config_ = config;
            this.frame_ = frame;
            //this.AddLegends([{pname:null,name:'shipType',icon:null,label:'船舶类型'}]);
            //this.AddLegends([{pname:'shipType',name:'',label:'客船',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAA2ElEQVRYR+2W0Q3CMAxEz5uzSjeADdoNygawAUzQ6lAiIisFjGloJfs7jZ/uzm4EGyrZEAsCZsmNUCaUsU5qZGbvmZkmAD2AI4ABkNGaAev5F5l5wJR1S2AEJNzF2uzdeQuMvoswVC3DEdZVHhjdmDYmOBm+ofoljLaUimXVPsrbWjA1S0u4at5awWi4DsBBD0ErmGuyLKlTn8S1YO6qefPMnItpogLm8ihD6fOe6QFpumcofdm8+QY+Pb3/67/JbLn7g3hc7f1x5Y6A+YLITGTGGprIzJJiM44HSCR6hUJvAAAAAElFTkSuQmCC"/>')}])
            //this.AddLegends([{pname:'shipType',name:'',label:'货船',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAABG0lEQVRYR+2WMQ7CMAxFvwOUmQWpIwMcgtNxFW5QbuAuwFhWJphY6QIbHwWEhAolpNAKpGRN7Lz4f1sR/NCSH2JBgClTI1QmVMa3U4Nn/tszu/GaIFSAxAjS/nyU+XrA93ypZy4wd4vA3oLhRAWiNF4ONr6Xuc6/DfOQiNwQkhgR7R7aaS8b7F2XufarwxQyE8gEklhp48UwdV38bP9rMEVJQaqBqI/faoF5JilE1OW3ZmCKdMQU7EyKTdAMDLkFRK2fgI6WdWI9MEROoYJG20J9d0Z9DYbg6jqHjMbLoTbbTeTWzpkWqNEx0mbnDJHDvtyhe5WK3GJeykRw5qt7LTCfJK0aGz5X//25qqr7J3HBM8Ezvv4Jnimr2BnMXYsk8tNaxQAAAABJRU5ErkJggg=="/>')}])
            //this.AddLegends([{pname:'shipType',name:'',label:'油船',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAA2klEQVRYR+2W0Q2DMAxEL5uzChu0G8AGsAHdoJ2A6lAiRRZR6ya4IDnfwX66O5sEnOiEE7HAYUpuuDKujHZSPTPXzswKrAAGADcAYwAmbQa094uZiTB5vWcEIyDhFm2zT/c1MLIWYahagiNs1amBkY1p4wYXgPEXqpYw0lIqllT7Km9HwexZmsPt5s0KRsL1ADo5BFYwj2jZpk5pEo+CeYnm5pmZs2miAupTowylT3uG0pvuGUqfNzffwPfk/V//TWrDG3zgj6trP64aREBdwjPjmdGGxjNTUuwNqAdIJElYavIAAAAASUVORK5CYII="/>')}])
            //this.AddLegends([{pname:'shipType',name:'',label:'渔船',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAA40lEQVRYR+2W/Q2DIBBHH4s3rNIN7Aa6gd2gblAnoAG0oURTzw+iyV3if+I9+T0uGE5U5kQsKMxcGrozujPSk6rOXNwZiwNqDBWOBksrdUD6/rwzESatN1BhqAe4l7TZv/clMPm3PEwK52E31RaYvHEbIvU7d6NZQ7UnTB6p922MdJFvR8FMRZrCTfpWCiaHuwMWyw9UKZgujInxySBG0qNgelyYURFg4YzaE+YZjnps7iHEtQWmww1HOQIUnTP9989j88IT2PGQ5i7OJlmg95mL32e2hL9yrTqjzkjVUWcu4cwHnqhQJKM3kJkAAAAASUVORK5CYII="/>')}])
            //this.AddLegends([{pname:'shipType',name:'',label:'公务船',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAABGUlEQVRYR+2WMQ7CMAxFv8NtuBEgBm7CVRjYyw3cG8CAlLHcABYQDPkoHRACquBCK5CSNbH95P9tRfBDR36IBRmmSY3cmdwZ66Rmz/y3Z5bDIUmqAAWcKyfb7drqAev7Rs9EmPtkBPYRjCHoAChH3lfWYqn3b8M8JSIrAoWI6OV4LGdVtU8VS923h3nOHGUsJAQde1+mCr+6/ybMLX8tKakA1OK3TmBeSQoRTfmtH5gHOpKLATl/HIJ+YMgdAY3SOUCbJrEbGPJQyxL3lHP67o76GgyBTdxDIQSdeh/Naz7tYchdPcqAnk8n7XfPkId6ySV0N7fjLiDVmZVV905gPknaNjZ/rv77c9VW90/ismeyZ6z+yZ5p6tgVzMOZJG+ydEoAAAAASUVORK5CYII="/>')}])
            //this.AddLegends([{pname:'shipType',name:'',label:'其它',icon:$('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAABDElEQVRYR+2WzQ2DMAyFYw4wJ5dI2aJrcOwGdINkg3YD2AAWsCtXrURb0tT8CSTnGuJ8vPdsBcyOFuyIxShMzA1VRpWRdqpm5tiZqaqKiMgbY+osy4K19irNgPT7aGYY5qNYR0Q1AHhEDM65RnpZ6nsJzFstImoAoGb1iqIIZVl2qctS+5NhRgqzjQ/lrLUhdfHY/pIww/qskmfVJHlbC+bLUoZL5W0TmBFLzoh4+myCrWBaVgYReVT4WCeuBdNzXtiWZ6D/mlGLwRDRjVud/945xwqI1xyY9jUE8zz3W8+ZnudIynexHIMDP5UhoovU91Vg5hSdelYfV8d+XE31fc45zYxmRpofzUxMsTv8w5IkYjMKNAAAAABJRU5ErkJggg=="/>')}])
            this.init_();
        }

        _createClass(LegendPlugin, [{
            key: "addLegends",
            value: function addLegends(list) {
                return this.addLegends_(list);
            }
        }, {
            key: "init_",
            value: function init_() {
                var toolbar = this.frame_.toolbars['right'];
                toolbar.addButton({
                    text: '图例',
                    icon: 'fa fa-map-signs',
                    click: this.showLegend_.bind(this)
                });
                this.legendPanel_ = $(legendDiv);
                this.legendPanel_.dialog({
                    title: '图例',
                    autoOpen: false
                });
            }
        }, {
            key: "legendInit_",
            value: function legendInit_(legend$) {
                var group = {};
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.legendList_[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var i = _step.value;

                        if (i.pname == null) {
                            var grp = $("<div></div>");
                            $("<h5></h5>").text(i.label).appendTo(grp);
                            $("<div></div>").addClass('map-legend-items').appendTo(grp);
                            grp.appendTo(legend$);
                            group[i.name] = grp;
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

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.legendList_[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var i = _step2.value;

                        if (i.pname in group) {
                            var el = $("<div></div>").addClass('map-legend-item');
                            el.append(i.icon);
                            $("<span></span>").text(i.label).appendTo(el);
                            el.appendTo(group[i.pname].find('.map-legend-items'));
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }, {
            key: "showLegend_",
            value: function showLegend_() {
                if (!this.isLegendInited_) {
                    this.isLegendInited_ = true;
                    this.legendInit_(this.legendPanel_);
                }
                if (this.legendPanel_.dialog('isOpen')) {
                    this.legendPanel_.dialog('close');
                } else {
                    this.legendPanel_.dialog('open');
                }
            }
        }, {
            key: "addLegends_",
            value: function addLegends_(list) {
                this.legendList_ = this.legendList_.concat(list);
            }
        }]);

        return LegendPlugin;
    }();

    LegendPlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame'))], LegendPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LegendPlugin;
});