import ShipEntity from "./ShipEntity";
import NotifiableObject from "./NotifiableObject";

class ScunionShipEntity extends ShipEntity {
    mmsi:number;
    type:number;
    status:number;
    dynamicTime:Date;
    staticTime:Date;
    callsign:string;
    draught:number;
    imo:string;
    eta:Date;
    destination:string;
}

export default ScunionShipEntity;
