import EventSource from "./EventSource";
import {FeatureEntity} from "./Feature";

class ShipEntity extends EventSource implements FeatureEntity {
    private id_:string;
    private time_:string;

    constructor(id:string, data) {
        super();
        Object.defineProperty(this, "id", {
            enumerable:true,
            writable:false,
            configurable:false,
            value: id
        });
        this.move(data);
    }
    id:string;
    lon:number;
    lat:number;
    sog:number;
    cog:number;
    heading:number;
    rot:number;
    name:string;
    dimensions:number[];
    time:Date;
    type:number;
    signal:string;
    origins:string[];

    v_name:string;
    v_length:number;
    v_width:number;
    v_type:number;

    get width():number {
        return this.dimensions ? this.dimensions[2] + this.dimensions[3] : null;
    }
    get length():number {
        return this.dimensions ? this.dimensions[0] + this.dimensions[1] : null;
    }
    move(to) {
       // console.log("move");
        for (var each in to) {
            if (each !== "id")
                this[each] = to[each];
        }
        //if(to.id==="MMSI:412700810")
        //    console.log(to.id,to.time,to.lat,to.lon,to.sog,to.cog);

        this.trigger("change");
    }
}
export default ShipEntity;
