define(["require", "exports"], function (require, exports) {
    "use strict";
    var SCDataTable = (function () {
        function SCDataTable(dt, actionList) {
            this._dt = dt.DataTable({
                "language": {
                    "scrollX": true,
                    "lengthMenu": "每页显示 _MENU_ 行",
                    "zeroRecords": "未找到任何项 - 抱歉!",
                    //"info": "当前 _PAGE_ / _PAGES_ 页",
                    "info": "显示 _START_ 到 _END_ 共 _TOTAL_ 条",
                    "infoEmpty": "没有可用的信息项",
                    "infoFiltered": "(从 _MAX_ 记录中过滤信息)",
                    "search": "搜索",
                    "paginate": {
                        "first": "首页",
                        "last": "末页",
                        "previous": "上一页",
                        "next": "下一页"
                    }
                },
                "pageLength": 25,
                "dom": "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-2'l><'col-sm-2'i><'col-sm-8 text-right'p>>"
            });
            this._actionList = actionList;
            this._rowTemplate = dt[0].children[1].children[0];
            //var order = this._dt.order();
            //alert( 'Column '+order[0][0]+' is the ordering column' );
            this._dt.row(0).remove().draw();
        }
        SCDataTable.prototype.fill = function (template, data, $tr) {
            //如果$tr未定义，该方法的作用是创建新行,否则只修改原有行的内容。
            if (!$tr) {
                $tr = $("<tr>");
            }
            else {
                $tr.empty();
            }
            var re = /{{.+}}/gi;
            var exps = template.match(re);
            exps.forEach(function (exp) {
                var prop = exp.substring(2, exp.length - 2);
                template = template.replace('{{' + prop + '}}', data[prop] || '');
            }.bind(this));
            //填充数据行内容。
            $tr.append($(template));
            $tr.data("rowData", data);
            var that = this;
            //为所有属于.table-click-action且包含data-clickaction属性的元素安装click事件
            //data-clickaction属性用于标记回掉方法名。
            $tr.find(".sc-datatable-action[data-clickaction]").click(function () {
                var actionName = $(this).attr("data-clickaction");
                if (actionName && that._actionList && that._actionList[actionName]) {
                    var cIndex = that._dt.row($(this).closest("tr")).index();
                    that._actionList[actionName](cIndex);
                }
            });
            return $tr;
            // return template;
        };
        SCDataTable.prototype.getData = function (index) {
            var row = this._dt.row(index);
            if (row) {
                return $(row.node()).data("rowData");
            }
        };
        SCDataTable.prototype.init = function (data) {
            this._dt.clear();
            data.forEach(function (item) {
                var tr = this.fill(this._rowTemplate.innerHTML, item);
                this._dt.row.add(tr);
            }.bind(this));
            this._dt.draw();
        };
        SCDataTable.prototype.add = function (data) {
            var tr = this.fill(this._rowTemplate.innerHTML, data);
            //var row = this._dt.row.add(tr).draw();
        };
        SCDataTable.prototype.remove = function (index) {
            var row = this._dt.row(index);
            if (row) {
                row.remove().draw();
            }
        };
        SCDataTable.prototype.update = function (index, data) {
            var row = this._dt.row(index);
            if (row) {
                var tr = row.node();
                this.fill(this._rowTemplate.innerHTML, data, $(tr));
            }
        };
        return SCDataTable;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SCDataTable;
});
