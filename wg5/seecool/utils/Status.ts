export class Status {
    constructor(owner) {
        this.owner_ = owner;
    }

    private casestatus_;
    private owner_;
    private status_ = "";

    public get Status() {
        return this.status_;
    }

    public ConditionTurn(condition, newStatus:string) {
        if (typeof(condition) == "string") {
            if (condition == this.status_)this.status_ = newStatus;
        }
        else {
            if (condition)this.status_ = newStatus;
        }
        return this;
    }

    public IfDo(status, callback) {
        if (status == this.status_)callback.bind(this.owner_)();
        return this;
    }

    public IfTurnDo(status, newStatus, callback) {
        if (status == this.status_) {
            callback.bind(this.owner_)();
            this.casestatus_ = newStatus;
        }
        return this;
    }

    public Turned() {
        this.status_ = this.casestatus_;
    }
}
export default Status