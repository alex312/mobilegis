import * as ko from "knockout";

var template = `
<div class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" data-bind="title_">提示</h4>
            </div>
            <div class="modal-body">
                <div data-bind='text:message_'>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" data-bind="click:cancel_">取消</button>
                <button type="button" class="btn btn-primary" data-bind="click:ok_">确定</button>
            </div>
        </div>
    </div>
</div>
`;

class Dialog {
    private template_;
    private viewDom_;
    private promise_;

    private title_;
    private message_;

    constructor(options?: {title?: string,message?: string}) {
        this.template_ = template;
        this.viewDom_ = $(this.template_);
        this.title_ = options && options.title || '';
        this.message_ = options && options.message || '';
        this.viewDom_.modal({keyboard: false, show: false});
        this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));

        this.promise_ = new Promise(function (resolve, reject) {
            this.cancel_ = function () {
                reject({state: "cancel", data: null});
                this.viewDom_.modal('hide');
            };
            this.ok_ = function () {
                resolve({state: "ok", data: null});
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
}
export default Dialog