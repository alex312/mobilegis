import * as template from "text!./PlotStyleSetDiv.html";
import * as ko from "knockout";

class PlotStyleSet{
    private template_;
    private viewDom_;
    private promise_;

    private title_;
    private name_;
    private remark_;
    private strokeColor_;
    private strokeTypes_;
    private selectedStrokeType_;
    private strokeWidths_;
    private selectedStrokeWidth_;
    private diaphas_;
    private selectedDiapha_;
    private fillColor_;
    private textColor_;
    private shadowColor_;
    private minScale_;

    constructor(options:{name?:string,remark?:string,strokeColor?:string,strokeType?:string,strokeWidth?:string,diapha?:string,fillColor?:string,textColor?:string,shadowColor?:string,minScale?:string,title?:string}) {
        this.template_ = template;
        this.viewDom_ = $(this.template_);
        this.title_ = options && options.title || "标绘样式设置";
        this.name_ = ko.observable(options.name || "");
            this.remark_ = ko.observable(options.remark || "");
            this.strokeColor_ = ko.observable(options.strokeColor || "#000000");
        this.strokeTypes_ = ko.observableArray([
            {value: 'solid', text: '────'},
            {value: 'dash', text: '-------'}
        ]);
        this.selectedStrokeType_ = ko.observable(options.strokeType || 'solid');
        this.strokeWidths_ = ko.observableArray([
            {value: '1', text: '1像素'},
            {value: '2', text: '2像素'},
            {value: '3', text: '3像素'},
            {value: '4', text: '4像素'}
        ]);
        this.selectedStrokeWidth_ = ko.observable(options.strokeWidth || '1');
        this.diaphas_ = ko.observableArray([
            {value: '0', text: '0'},
            {value: '0.1', text: '0.1'},
            {value: '0.2', text: '0.2'},
            {value: '0.3', text: '0.3'},
            {value: '0.4', text: '0.4'},
            {value: '0.5', text: '0.5'},
            {value: '0.6', text: '0.6'},
            {value: '0.7', text: '0.7'},
            {value: '0.8', text: '0.8'},
            {value: '0.9', text: '0.9'},
            {value: '1', text: '1'}
        ]);
        this.selectedDiapha_ = ko.observable(options.diapha || '0');
        this.fillColor_ = ko.observable(options.fillColor || '#000000');
        this.textColor_ = ko.observable(options.textColor || '#000000');
        this.shadowColor_ = ko.observable(options.shadowColor || '#000000');
        this.minScale_ = ko.observable(options.minScale || '4');

        this.viewDom_.modal({keyboard: false, show: false});
        this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));

        this.promise_ = new Promise(function (resolve, reject) {
            this.cancel_ = function () {
                reject({state: "cancel", data: null});
                this.viewDom_.modal('hide');
            };
            this.ok_ = function () {
                //取值
                var name=this.name_();
                var remark=this.remark_();
                var strokeColor=this.strokeColor_();
                var strokeType=this.selectedStrokeType_();
                var strokeWidth=this.selectedStrokeWidth_();
                var diapha=this.selectedDiapha_();
                var fillColor=this.fillColor_();
                var textColor=this.textColor_();
                var shadowColor=this.shadowColor_();
                var minScale=this.minScale_();
                //验证
                var ready = this.validate_(name, null, null);
                //确认返回
                if (ready) {
                    //this.view.dialog('destroy');
                    resolve({state: "ok", data:{
                        name:name,
                        remark:remark,
                        strokeColor:strokeColor,
                        strokeType:strokeType,
                        strokeWidth:strokeWidth,
                        diapha:diapha,
                        fillColor:fillColor,
                        textColor:textColor,
                        shadowColor:shadowColor,
                        minScale:minScale
                    }});
                }
                this.viewDom_.modal('hide');
            }
        }.bind(this));
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
export default PlotStyleSet