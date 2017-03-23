import * as utilities from 'seecool/utilities';

import {getShipTypeInfo} from "seecool/StaticLib";

import "jquery";
import "kendo";

var kendoTemplates = {
    text: function (data) {
        return '<div>' +
            '<div class="primary-text">' + data.name + '[' + data.mmsi + ']</div>' +
            '</div>';
    },
    icon: function (data) {
        // var texture = data.type
        //     && utilities.Images.images[data.type]
        //     && utilities.Images.images[data.type].texture;
        // var style = texture ? ('background:url(' + texture.src + ') -' + utilities.Images.images[data.type].frame.x + 'px -' + utilities.Images.images[data.type].frame.y + 'px; width: 16px; height: 16px;') : '';
        // return '<span class="icon" style="' + style + '"></span>';
        return '<span class="icon">?</span>';
    },
    checkbox: function (data) {
        return '<input type="checkbox" '
            + (data.selected ? 'checked="checked"' : '') + '/>';
    },
    checkAll: function (data) {
        return '<input type="checkbox" class="checkall" '
            + (data.selected ? 'checked="checked"' : '') + '/>';
    },
    destroy: function () {
        return '<span class="buttons">' +
            '<button class="k-grid-delete trash"></button> ' +
            '</span>';
    }
};

var kendoPagerMessages = {
    display: "{0} - {1}/共{2}条", //{0} is the index of the first record on the page, {1} - index of the last record on the page, {2} is the total amount of records
    empty: "没有可显示的记录",
    page: "第",
    of: "页/共{0}页", //{0} is total amount of pages
    itemsPerPage: "条/页",
    first: "转到首页",
    previous: "上一页",
    next: "下一页",
    last: "转到末页",
    refresh: "刷新"
};

class ShipSelector {
    dataSource_;
    divGrid_;
    popup_;

    constructor(element) {
        this.dataSource_ = new kendo.data.DataSource([]);

        this.divGrid_ = $('<div></div>')
            .addClass('ship-list')
            .appendTo(element)
            .kendoGrid({
                dataSource: this.dataSource_,
                scrollable: true,
                columns: [
                    {template: kendoTemplates.icon, width: '32px'},
                    {title: '船舶列表', template: kendoTemplates.text},
                    {
                        template: kendoTemplates.destroy,
                        headerTemplate: kendoTemplates.destroy,
                        width: '32px'
                    }
                ]
            })
            .on('click', '.k-grid-delete', $.proxy(this.gridDeleteButtonClick_, this));
        this.resize();
        this.popup_ = new ShipSelectorDialog(this.dataSource_);
    }

    resize() {
        var gridContent = this.divGrid_.find('.k-grid-content');
        var g = this.divGrid_.height();
        var c = gridContent.height();
        var p = this.divGrid_.parent().height();
        var h = Math.max(30, p - ( g - c));
        gridContent.css({'height': h + 'px'});
    };

    add(ship) {
        var item = this.dataSource_.get(ship.id);
        if (!item)
            this.dataSource_.add(ship);
    };

    remove(ship) {
        var item = this.dataSource_.get(ship.id);
        if (item)this.dataSource_.remove(item);
    };

    clear(ship) {
        var item = this.dataSource_.get(ship.id);
        if (item)this.dataSource_.remove(item);
    };

    getItems() {
        var d = this.dataSource_.data(), r = [];
        for (var i = 0; i < d.length; i++)
            r.push(d[i]);
        return r;
    };

    popup() {
        this.popup_.open();
    };

    depopup() {
        this.popup_.close();
    };

    gridDeleteButtonClick_(evt) {
        var grid = (<any>$(evt.delegateTarget)).data("kendoGrid");
        var tr = $(evt.target).closest('tr');
        if (tr.parent().is('thead')) {
            var items = this.dataSource_.data();
            while (items.length)
                this.dataSource_.remove(items[0]);
        } else {
            var dataItem = grid.dataItem(tr);
            this.dataSource_.remove(dataItem);
        }
    };
}

class ShipSelectorDialog {
    element_;
    search_;

    constructor(dataSource) {
        this.element_ = $('<div></div>');

        this.element_.dialog({
            //title: '选择船舶',
            title: "<div class='widget-header'><h4 class='smaller'>选择船舶</h4></div>",//"提示",
            title_html: true,
            autoOpen: false,
            width: 'auto',
            height: 'auto',
            dialogClass: 'ship-selector-dialog',
            resizable: false
        });

        var divTab = $('<div></div>')
            .css({background: 'white', border: 'none'})
            .appendTo(this.element_);
        var ul = $(document.createElement('ul')).appendTo(divTab);
        //$('<li class="k-state-active">我的船队</li>').appendTo(ul);
        $('<li class="k-state-active">自定义搜索</li>').appendTo(ul);

        //var divTeam = $(document.createElement('div'))
        //    .css({width: '420px'})
        //    .appendTo(divTab);
        var divSearch = $(document.createElement('div'))
            .css({width: '420px'})
            .appendTo(divTab);

        //this.team_ = new TeamPanel1999(divTeam, dataSource);
        this.search_ = new SearchPanel1999(divSearch, dataSource);

        divTab.kendoTabStrip({
            animation: false,
            activate: function (evt) {
                var panel = $(evt.contentElement).data('ShipSelectorPanel');
                panel.focus();
            }
        });

        $(window).resize($.proxy(this.reposition_, this));
    }

    reposition_() {
        var wg = this.element_.dialog("widget");
        var h = wg.height();
        var w = wg.width();
        var of = wg.offset();
        var cw = document.body.clientWidth;
        var ch = document.body.clientHeight;
        if (of.left + w > cw)
            wg[0].style.left = Math.max(cw - w, 0) + 'px';
        if (of.top + h > ch)
            wg[0].style.top = Math.max(ch - h, 0) + 'px';
    };

    open() {
        if (!this.element_.dialog('isOpen')) {
            this.element_.dialog('open');
        }
    };

    close() {
        this.element_.dialog('close');
    };
}

class BasePanel {
    dataSource_;
    divGrid_;
    dataSourceShip_;

    constructor(element, dataSource) {
        this.dataSource_ = dataSource;
        this.dataSource_.bind('change', $.proxy(this.dataSourceChange_, this));

        this.dataSourceShip_ = new kendo.data.DataSource(this.dataSourceShipOptions_());

        this.createFilterUi_(element);

        this.divGrid_ = $('<div></div>')
            .addClass('ship-list')
            .appendTo(element)
            .kendoGrid(this.gridOptions_())
            .on('click', 'td[role=gridcell]', $.proxy(this.gridCheckboxClick_, this))
            .on('click', 'input[type=checkbox].checkall', $.proxy(this.gridCheckallClick_, this));
        this.divGrid_.find('.k-grid-content').css({height: '200px'});
        element.data('ShipSelectorPanel', this);
    }

    focus() {
    };

    dataSourceShipOptions_() {
        return {
            transport: {read: $.proxy(this.dataSourceShipTransportRead_, this)},
            change: $.proxy(this.dataSourceShipChange_, this)
        };
    };

    gridOptions_() {
        return {
            dataSource: this.dataSourceShip_,
            scrollable: true,
            columns: [
                {
                    template: kendoTemplates.checkbox,
                    headerTemplate: kendoTemplates.checkAll,
                    name: 'selected', width: '32px'
                },
                {template: kendoTemplates.icon, width: '32px'},
                {title: '船舶', template: kendoTemplates.text}
            ],
            dataBound: $.proxy(this.gridDataBound_, this)
        }
    };

    createFilterUi_(element) {
    };

    dataSourceShipTransportRead_(options) {
    };

    gridCheckallClick_(evt) {
        var ckb = $(evt.target);
        var checked = ckb.prop('checked');
        var grid = (<any>$(evt.delegateTarget)).data("kendoGrid");
        var dataItems = [];
        grid.tbody.children().each(function () {
            dataItems.push(grid.dataItem(this));
        });
        for (var i = 0, c = dataItems.length; i < c; i++)
            dataItems[i].set('selected', checked);
    };

    gridCheckboxClick_(evt) {
        var grid = (<any>$(evt.delegateTarget)).data("kendoGrid");
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
    };

    gridDataBound_(evt) {
        var grid = (<any>this.divGrid_).data("kendoGrid");
        var checks = grid.tbody.find('input[type=checkbox]');
        var checkall = grid.thead.find('input[type=checkbox].checkall');
        var allChecked = true;
        if (!checks.length)
            allChecked = false;
        else
            for (var i = 0; i < checks.length; i++) {
                if (!checks[i].checked) {
                    allChecked = false;
                    break;
                }
            }
        checkall[0].checked = allChecked;
    };

    dataSourceChange_(evt) {
        if (evt.action === 'remove') {
            for (var i = 0, l = evt.items.length; i < l; i++) {
                var it = evt.items[i];
                var it2 = this.dataSourceShip_.get(it.id);
                if (it2)
                    it2.set('selected', false);
            }
        }
    };

    dataSourceShipChange_(evt) {
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
    };
}

class SearchPanel1999 extends BasePanel {
    txtKeyword_;

    constructor(element, dataSource) {
        super(element, dataSource);
    }

    dataSourceShipOptions_() {
        var options = super.dataSourceShipOptions_.apply(this, arguments);
        return $.extend(true, options, {
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            filter: {field: "keyword", operator: "contains", value: ""},
            schema: {data: 'data', total: 'total'}
        });
    };

    gridOptions_() {
        var options = super.gridOptions_();
        return $.extend(true, options, {
            pageable: {
                buttonCount: 5,
                messages: kendoPagerMessages
            }
        });
    };

    createFilterUi_(element) {
        var txtKeyword = $('<input type="text" />')
            .attr('placeholder', '请输入关键字')
            .attr('maxlength', 30)
            .appendTo(element)
            .kendoAutoComplete();
        this.txtKeyword_ = txtKeyword
            .data('kendoAutoComplete')
            .bind('change', $.proxy(this.keywordChange_, this));
        $(element.children()[0]).append('<span class="k-icon k-search"></span>');
        $(element.children()[0]).append('<style> input::-ms-clear { display:none; } </style>');
    };

    focus() {
        this.txtKeyword_.focus();
    };

    dataSourceShipTransportRead_(options) {
        var keyword = options.data.filter.filters[0].value;
        var callback = $.proxy(this.dataSourceShipTransportReadDone_, this, options);
        if (!keyword) {
            options.error(null, "nullkeyword", "关键字为空");
        } else {
            var ajax = $.ajax({
                url: 'api/shiphistory/RealtimeData/GetRealTimeDataBySearchkey/' + keyword,
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
    };

    dataSourceShipTransportReadDone_(options, result) {
        var items; // = result && result.Summaries || [];
        var total; // = result && result.Total || 0;

        items = result;
        total = 1;

        var ids = [], ships = [];
        var data = this.dataSource_.data();
        for (var i = 0, l = data.length; i < l; i++)
            ids.push(data[i].id);

        for (var ii = 0, ll = items.length; ii < ll; ii++) {
            var it = items[ii], uid = it.UniqueID;
            //var ship = {               //lwh
            //    id: uid,
            //    name: it.ZWCM || it.YWCM || '?',
            //    mmsi: parseInt((/[\.\:\ ](\d+)$/.exec(uid) || [0, 0])[1]) || 0,
            //    type: (/^[a-zA-Z0-9]+/.exec(uid) || [null])[0],
            //    callSign: it.CBHH,
            //    selected: ids.indexOf(uid) >= 0
            //};
            uid = it.ShipId;
            var shipType = getShipTypeInfo(it.ShipType, null, "Labels"); //utils.getAisSimpleShipTypeName(it.ShipType);
            var ship = {
                id: uid,
                name: it.V_Name || it.Name || it.MMSI || '?',
                mmsi: parseInt((<any>(/[\.\:\ ](\d+)$/.exec(it.MMSI) || [0, 0])[1])) || 0,
                type: shipType, //(/^[a-zA-Z0-9]+/.exec(uid) || [null])[0],
                callSign: it.CBHH || '?',
                selected: ids.indexOf(uid) >= 0
            };

            ships.push(ship);
        }
        options.success({
            data: ships,
            total: total
        });
    };

    keywordChange_(evt) {
        var keyword = evt.sender.value() || '';
        this.dataSourceShip_.filter({
            field: "keyword",
            operator: "contains",
            value: keyword.trim()
        });
    };
}
export default ShipSelector;


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