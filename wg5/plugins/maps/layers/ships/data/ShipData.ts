import {lon3857} from "seecool/utilities";
import {lat3857} from "seecool/utilities";

import Feature from "./Feature";
import ShipEntity from "./ShipEntity";

export class ShipData extends Feature {
    private version_:number = 0;
    private lon3857_:number = NaN;
    private lat3857_:number = NaN;
    private track_:ShipEntity[] = [];
    private track3857_:number[][] = [];
    private entity_change_handler_ = this.onEntityChange_.bind(this);
    private hoveredPiece_:any = null;

    constructor(entity:ShipEntity) {
        super(entity);
        let en = (<ShipEntity>(this.entity));
        en.bind("change", this.entity_change_handler_);
        this.onEntityChange_();
    }

    destroy() {
        (<ShipEntity>(this.entity)).unbind("change", this.entity_change_handler_);
        super.destroy();
    }

    focus(piece:any){
        super.focus(piece);
        this.version_++;
        this.trigger("change");
    }
    hover(piece:any) {
        super.hover(piece);
        this.hoveredPiece_ = piece;
    }

    get hoveredPiece():any {
        return this.hoveredPiece_;
    }

    private updateLonLat_():void {
        let en = (<ShipEntity>(this.entity));
        let lon:number = en.lon;
        let lat:number = en.lat;
        this.lon3857_ = lon3857(lon);
        this.lat3857_ = lat3857(lat);
    }

    private onEntityChange_() {

        //console.log("onEntityChange_");
        this.updateLonLat_();
        let entity = <ShipEntity>this.entity;
        //if (!this.track_.length || this.track_[this.track_.length - 1].time !== entity.time) {
        //    let tp = new (<new(id:string, data:any)=>ShipEntity>entity.constructor)(this.id, entity);
        //    this.track_.push(tp);
        //    this.track3857_.push([this.lon3857_, this.lat3857_]);
        //}
        this.version_++;
        this.trigger("change");
    }

    get version():number {
        return this.version_;
    }

    get lon3857():number {
        return this.lon3857_;
    }

    get lat3857():number {
        return this.lat3857_;
    }

    get track():ShipEntity[] {
        return this.track_;
    }

    get track3857():number[][] {
        return this.track3857_;
    }

    prependTrack(points:any[]) {
        if(points.length) {
            var cstr = (<new(id:string, data:any)=>ShipEntity>this.entity.constructor);
            var track = new Array(points.length);
            var track3857 = new Array(points.length);
            for (var i = 0; i < points.length; i++) {
                var item = points[i];
                track[i] = new cstr(item.id, item);
                track3857[i] = [lon3857(item.lon), lat3857(item.lat)];
            }
            this.track_.unshift.apply(this.track_, track);
            this.track3857_.unshift.apply(this.track3857_, track3857);
            this.version_++;
            this.trigger("change");
        }
    }
}

export default ShipData;
