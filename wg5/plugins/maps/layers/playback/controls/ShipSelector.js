"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery", "../../../../../seecool/StaticLib", "kendo"], function (require, exports, $, StaticLib_1) {
    "use strict";

    var kendoTemplates = {
        text: function text(data) {
            return '<div>' + '<div class="primary-text">' + data.name + '[' + data.mmsi + ']</div>' + '</div>';
        },
        icon: function icon(data) {
            // var texture = data.type
            //     && utilities.Images.images[data.type]
            //     && utilities.Images.images[data.type].texture;
            // var style = texture ? ('background:url(' + texture.src + ') -' + utilities.Images.images[data.type].frame.x + 'px -' + utilities.Images.images[data.type].frame.y + 'px; width: 16px; height: 16px;') : '';
            // return '<span class="icon" style="' + style + '"></span>';
            return '<span class="icon">&nbsp;</span>';
        },
        checkbox: function checkbox(data) {
            return '<input type="checkbox" ' + (data.selected ? 'checked="checked"' : '') + '/>';
        },
        checkAll: function checkAll(data) {
            return '<input type="checkbox" class="checkall" ' + (data.selected ? 'checked="checked"' : '') + '/>';
        },
        destroy: function destroy() {
            return '<span class="buttons">' + '<a class="k-grid-delete"><i class="fa fa-trash"></i></a> ' + '</span>';
        }
    };
    var kendoPagerMessages = {
        display: "{0} - {1}/共{2}条",
        empty: "没有可显示的记录",
        page: "第",
        of: "页/共{0}页",
        itemsPerPage: "条/页",
        first: "转到首页",
        previous: "上一页",
        next: "下一页",
        last: "转到末页",
        refresh: "刷新"
    };

    var ShipSelector = function () {
        function ShipSelector(element, url) {
            _classCallCheck(this, ShipSelector);

            this.dataSource_ = new kendo.data.DataSource([]);
            this.element_ = element;
            this.divGrid_ = $('<div></div>').addClass('ship-list').appendTo(element).kendoGrid({
                dataSource: this.dataSource_,
                scrollable: true,
                columns: [{ template: kendoTemplates.icon, width: '32px' }, { title: '船舶列表', template: kendoTemplates.text }, {
                    template: kendoTemplates.destroy,
                    headerTemplate: kendoTemplates.destroy,
                    width: '32px'
                }]
            }).on('click', '.k-grid-delete', $.proxy(this.gridDeleteButtonClick_, this));
            this.resize();
            this.popup_ = new ShipSelectorDialog(this.dataSource_, url);
        }

        _createClass(ShipSelector, [{
            key: "resize",
            value: function resize() {
                var gridContent = this.divGrid_.find('.k-grid-content');
                var g = this.divGrid_.height();
                var c = gridContent.height();
                var p = this.element_.height();
                var h = Math.max(30, p - (g - c));
                gridContent.css({ 'height': h + 'px' });
                console.log(g, c, p, h);
            }
        }, {
            key: "add",
            value: function add(ship) {
                var item = this.dataSource_.get(ship.id);
                if (!item) this.dataSource_.add(ship);
            }
        }, {
            key: "remove",
            value: function remove(ship) {
                var item = this.dataSource_.get(ship.id);
                if (item) this.dataSource_.remove(item);
            }
        }, {
            key: "clear",
            value: function clear(ship) {
                var item = this.dataSource_.get(ship.id);
                if (item) this.dataSource_.remove(item);
            }
        }, {
            key: "getItems",
            value: function getItems() {
                var d = this.dataSource_.data(),
                    r = [];
                for (var i = 0; i < d.length; i++) {
                    r.push(d[i]);
                }return r;
            }
        }, {
            key: "popup",
            value: function popup() {
                this.popup_.open();
            }
        }, {
            key: "depopup",
            value: function depopup() {
                this.popup_.close();
            }
        }, {
            key: "gridDeleteButtonClick_",
            value: function gridDeleteButtonClick_(evt) {
                var grid = $(evt.delegateTarget).data("kendoGrid");
                var tr = $(evt.target).closest('tr');
                if (tr.parent().is('thead')) {
                    var items = this.dataSource_.data();
                    while (items.length) {
                        this.dataSource_.remove(items[0]);
                    }
                } else {
                    var dataItem = grid.dataItem(tr);
                    this.dataSource_.remove(dataItem);
                }
            }
        }]);

        return ShipSelector;
    }();

    var ShipSelectorDialog = function () {
        function ShipSelectorDialog(dataSource, url) {
            _classCallCheck(this, ShipSelectorDialog);

            this.element_ = $('<div></div>');
            this.element_.dialog({
                title: "选择船舶",
                autoOpen: false,
                width: 'auto',
                height: 'auto',
                dialogClass: 'ship-selector-dialog',
                resizable: false
            });
            var divTab = $('<div></div>').css({ background: 'white', border: 'none' }).appendTo(this.element_);
            var ul = $(document.createElement('ul')).appendTo(divTab);
            //$('<li class="k-state-active">我的船队</li>').appendTo(ul);
            $('<li class="k-state-active">自定义搜索</li>').appendTo(ul);
            //var divTeam = $(document.createElement('div'))
            //    .css({width: '420px'})
            //    .appendTo(divTab);
            var divSearch = $(document.createElement('div')).css({ width: '420px' }).appendTo(divTab);
            //this.team_ = new TeamPanel1999(divTeam, dataSource);
            this.search_ = new SearchPanel1999(divSearch, dataSource, url);
            divTab.kendoTabStrip({
                animation: false,
                activate: function activate(evt) {
                    var panel = $(evt.contentElement).data('ShipSelectorPanel');
                    panel.focus();
                }
            });
            $(window).resize($.proxy(this.reposition_, this));
        }

        _createClass(ShipSelectorDialog, [{
            key: "reposition_",
            value: function reposition_() {
                var wg = this.element_.dialog("widget");
                var h = wg.height();
                var w = wg.width();
                var of = wg.offset();
                var cw = document.body.clientWidth;
                var ch = document.body.clientHeight;
                if (of.left + w > cw) wg[0].style.left = Math.max(cw - w, 0) + 'px';
                if (of.top + h > ch) wg[0].style.top = Math.max(ch - h, 0) + 'px';
            }
        }, {
            key: "open",
            value: function open() {
                if (!this.element_.dialog('isOpen')) {
                    this.element_.dialog('open');
                }
            }
        }, {
            key: "close",
            value: function close() {
                this.element_.dialog('close');
            }
        }]);

        return ShipSelectorDialog;
    }();

    var BasePanel = function () {
        function BasePanel(element, dataSource) {
            _classCallCheck(this, BasePanel);

            this.dataSource_ = dataSource;
            this.dataSource_.bind('change', $.proxy(this.dataSourceChange_, this));
            this.dataSourceShip_ = new kendo.data.DataSource(this.dataSourceShipOptions_());
            this.createFilterUi_(element);
            this.divGrid_ = $('<div></div>').addClass('ship-list').appendTo(element).kendoGrid(this.gridOptions_()).on('click', 'td[role=gridcell]', $.proxy(this.gridCheckboxClick_, this)).on('click', 'input[type=checkbox].checkall', $.proxy(this.gridCheckallClick_, this));
            this.divGrid_.find('.k-grid-content').css({ height: '200px' });
            element.data('ShipSelectorPanel', this);
        }

        _createClass(BasePanel, [{
            key: "focus",
            value: function focus() {}
        }, {
            key: "dataSourceShipOptions_",
            value: function dataSourceShipOptions_() {
                return {
                    transport: { read: $.proxy(this.dataSourceShipTransportRead_, this) },
                    change: $.proxy(this.dataSourceShipChange_, this)
                };
            }
        }, {
            key: "gridOptions_",
            value: function gridOptions_() {
                return {
                    dataSource: this.dataSourceShip_,
                    scrollable: true,
                    columns: [{
                        template: kendoTemplates.checkbox,
                        headerTemplate: kendoTemplates.checkAll,
                        name: 'selected', width: '32px'
                    }, { template: kendoTemplates.icon, width: '32px' }, { title: '船舶', template: kendoTemplates.text }],
                    dataBound: $.proxy(this.gridDataBound_, this)
                };
            }
        }, {
            key: "createFilterUi_",
            value: function createFilterUi_(element) {}
        }, {
            key: "dataSourceShipTransportRead_",
            value: function dataSourceShipTransportRead_(options) {}
        }, {
            key: "gridCheckallClick_",
            value: function gridCheckallClick_(evt) {
                var ckb = $(evt.target);
                var checked = ckb.prop('checked');
                var grid = $(evt.delegateTarget).data("kendoGrid");
                var dataItems = [];
                grid.tbody.children().each(function () {
                    dataItems.push(grid.dataItem(this));
                });
                for (var i = 0, c = dataItems.length; i < c; i++) {
                    dataItems[i].set('selected', checked);
                }
            }
        }, {
            key: "gridCheckboxClick_",
            value: function gridCheckboxClick_(evt) {
                var grid = $(evt.delegateTarget).data("kendoGrid");
                //var checkall = grid.thead.find('input[type=checkbox].checkall');
                var tr = $(evt.target).closest('tr');
                var ckb = tr.find('input[type=checkbox]');
                var checked = ckb.prop('checked');
                if (ckb[0] !== evt.target) {
                    checked = !checked;
                    ckb.prop('checked', checked);
                }
                var td = ckb.closest('td');
                var dataItem = grid.dataItem(tr);
                dataItem.set(grid.columns[td.index()].name, checked);
            }
        }, {
            key: "gridDataBound_",
            value: function gridDataBound_(evt) {
                var grid = this.divGrid_.data("kendoGrid");
                var checks = grid.tbody.find('input[type=checkbox]');
                var checkall = grid.thead.find('input[type=checkbox].checkall');
                var allChecked = true;
                if (!checks.length) allChecked = false;else for (var i = 0; i < checks.length; i++) {
                    if (!checks[i].checked) {
                        allChecked = false;
                        break;
                    }
                }
                checkall[0].checked = allChecked;
            }
        }, {
            key: "dataSourceChange_",
            value: function dataSourceChange_(evt) {
                if (evt.action === 'remove') {
                    for (var i = 0, l = evt.items.length; i < l; i++) {
                        var it = evt.items[i];
                        var it2 = this.dataSourceShip_.get(it.id);
                        if (it2) it2.set('selected', false);
                    }
                }
            }
        }, {
            key: "dataSourceShipChange_",
            value: function dataSourceShipChange_(evt) {
                if (evt.action === 'itemchange') {
                    for (var i = 0, l = evt.items.length; i < l; i++) {
                        var it = evt.items[i];
                        var it0 = this.dataSource_.get(it.id);
                        if (!it.selected && it0) {
                            this.dataSource_.remove(it0);
                        } else if (it.selected && !it0) {
                            this.dataSource_.add(it);
                        }
                    }
                }
            }
        }]);

        return BasePanel;
    }();

    var SearchPanel1999 = function (_BasePanel) {
        _inherits(SearchPanel1999, _BasePanel);

        function SearchPanel1999(element, dataSource, url) {
            _classCallCheck(this, SearchPanel1999);

            var _this = _possibleConstructorReturn(this, (SearchPanel1999.__proto__ || Object.getPrototypeOf(SearchPanel1999)).call(this, element, dataSource));

            _this.url = url;
            return _this;
        }

        _createClass(SearchPanel1999, [{
            key: "dataSourceShipOptions_",
            value: function dataSourceShipOptions_() {
                var options = _get(SearchPanel1999.prototype.__proto__ || Object.getPrototypeOf(SearchPanel1999.prototype), "dataSourceShipOptions_", this).apply(this, arguments);
                return $.extend(true, options, {
                    pageSize: 10,
                    serverPaging: false,
                    serverFiltering: true,
                    filter: { field: "keyword", operator: "contains", value: "" },
                    schema: { data: 'data', total: 'total' }
                });
            }
        }, {
            key: "gridOptions_",
            value: function gridOptions_() {
                var options = _get(SearchPanel1999.prototype.__proto__ || Object.getPrototypeOf(SearchPanel1999.prototype), "gridOptions_", this).call(this);
                return $.extend(true, options, {
                    pageable: {
                        buttonCount: 5,
                        messages: kendoPagerMessages
                    }
                });
            }
        }, {
            key: "createFilterUi_",
            value: function createFilterUi_(element) {
                var txtKeyword = $('<input type="text" />').attr('placeholder', '请输入关键字').attr('maxlength', 30).appendTo(element).kendoAutoComplete();
                this.txtKeyword_ = txtKeyword.data('kendoAutoComplete').bind('change', $.proxy(this.keywordChange_, this));
            }
        }, {
            key: "focus",
            value: function focus() {
                this.txtKeyword_.focus();
            }
        }, {
            key: "dataSourceShipTransportRead_",
            value: function dataSourceShipTransportRead_(options) {
                var keyword = options.data.filter.filters[0].value;
                var callback = $.proxy(this.dataSourceShipTransportReadDone_, this, options);
                if (!keyword) {
                    options.error(null, "nullkeyword", "关键字为空");
                } else {
                    var ajax = $.ajax({
                        url: this.url + '/RealtimeData/GetRealTimeDataBySearchkey/' + keyword,
                        //data: {
                        //    'q': keyword,
                        //    'index': options.data.skip,
                        //    'count': options.data.take,
                        //    'sort': 'name'
                        //},
                        type: 'get',
                        dataType: 'json'
                    });
                    ajax.done(callback);
                    ajax.fail(options.error);
                }
            }
        }, {
            key: "dataSourceShipTransportReadDone_",
            value: function dataSourceShipTransportReadDone_(options, result) {
                var items; // = result && result.Summaries || [];
                var total; // = result && result.Total || 0;
                items = result;
                total = 1;
                var ids = [],
                    ships = [];
                var data = this.dataSource_.data();
                for (var i = 0, l = data.length; i < l; i++) {
                    ids.push(data[i].id);
                }for (var ii = 0, ll = items.length; ii < ll; ii++) {
                    var it = items[ii],
                        uid = it.UniqueID;
                    //var ship = {               //lwh
                    //    id: uid,
                    //    name: it.ZWCM || it.YWCM || '?',
                    //    mmsi: parseInt((/[\.\:\ ](\d+)$/.exec(uid) || [0, 0])[1]) || 0,
                    //    type: (/^[a-zA-Z0-9]+/.exec(uid) || [null])[0],
                    //    callSign: it.CBHH,
                    //    selected: ids.indexOf(uid) >= 0
                    //};
                    uid = it.ShipId;
                    var shipType = StaticLib_1.getShipTypeInfo(it.ShipType, null, "Labels"); //utils.getAisSimpleShipTypeName(it.ShipType);
                    var ship = {
                        id: uid,
                        name: it.V_Name || it.Name || it.MMSI || '?',
                        mmsi: parseInt((/[\.\:\ ](\d+)$/.exec(it.MMSI) || [0, 0])[1]) || 0,
                        type: shipType,
                        callSign: it.CBHH || '?',
                        selected: ids.indexOf(uid) >= 0
                    };
                    ships.push(ship);
                }
                options.success({
                    data: ships,
                    total: ships.length
                });
            }
        }, {
            key: "keywordChange_",
            value: function keywordChange_(evt) {
                var keyword = evt.sender.value() || '';
                this.dataSourceShip_.filter({
                    field: "keyword",
                    operator: "contains",
                    value: keyword.trim()
                });
            }
        }]);

        return SearchPanel1999;
    }(BasePanel);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipSelector;
});
//define([
//     'jquery',
//     'kendo',
//     // 'seecool/user',
//     'plugins/shipLayer/StaticLib',
//     'seecool/utils/utils'
// ], function ($, kendo,/* user,*/ shipLayerStaticLib,utils) {
//
//
//     function inherit(derived, base) {
//         for (var each in base.prototype)
//             derived.prototype[each] = base.prototype[each];
//     }
//
//     return ShipSelector;
// });