import * as template from 'text!./PlotInfoSetDiv.html';
import * as utilities from 'seecool/utilities';
import * as ko from "knockout";

class PlotInfoSet {
    private template_;
    private viewDom_;
    private promise_;

    private title_;
    private name_;
    private remark_;
    private lonlats_;

    constructor(options: {lonlats: any[],title?:string}) {
        var lonlats = options.lonlats;
        lonlats = lonlats.map(function (v) {
            var lon = utilities.formatDegree(v[0], 'ddd-cc-mm.mmL');
            var lat = utilities.formatDegree(v[1], 'dd-cc-mm.mmB');
            return {lon: lon, lat: lat};
        });

        this.title_ = options && options.title || "新建标绘";
        this.template_ = template;
        this.viewDom_ = $(this.template_);
        this.name_ = ko.observable();
        this.remark_ = ko.observable();
        this.lonlats_ = ko.observable();
        this.viewDom_.modal({keyboard: false, show: false});
        this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));

        this.name_("");
        this.remark_("");
        this.lonlats_(lonlats);

        this.promise_ = new Promise(function (resolve, reject) {
            this.ok_ = function () {
                ////取目标
                //var name$ = this.viewDom_.find('#plotName');
                //var remark$ = this.viewDom_.find('#plotRemark');
                //var lonlats$ = this.viewDom_.find("#lonlats");

                //取值
                var name = this.name_();
                var remark = this.remark_();
                var lonlats = this.lonlats_();

                //验证
                var ready = this.validate_(name, null, lonlats);

                //确认返回
                if (ready) {
                    lonlats = lonlats.map(function (v) {
                        var lon = utilities.degreeToDecimal(v.lon);
                        var lat = utilities.degreeToDecimal(v.lat);
                        return {lon: lon, lat: lat};
                    })
                    resolve({state: "ok", data: {name: name, remark: remark, lonlats: lonlats}});
                    this.viewDom_.modal('hide');
                }
            }.bind(this);
            this.cancel_ = function () {
                reject({state: "cancel", data: null});
            }.bind(this);
            // title: "<div class='widget-header'><h4 class='smaller'>新建标绘</h4></div>",//"提示",
            //     title_html:true,
            //     resizable: false,
            //     autoOpen: true,
            //     modal: true,
            //     width: '350px',
            //     buttons: buttons,
            //     close: function () {
            //     this.viewDom_.dialog('destroy');
            //     reject({state: "close", data: null});
            // }.bind(this)
        }.bind(this))

        ko.applyBindings(this, this.viewDom_[0]);
    }


    public show() {
        this.viewDom_.modal('show');
        return this.promise_;
    }

    public destroy() {
        this.viewDom_.remove();
    }

    private cancel_;
    private ok_;

    private validate_(name, remark, lonlats) {
        if (!name || name.trim().length === 0) {
            alert("名称不能为空.");
            return false;
        }

        return true;
    }
}
export default PlotInfoSet;