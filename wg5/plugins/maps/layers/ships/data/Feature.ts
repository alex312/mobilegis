import NotifiableObject from "./NotifiableObject";

export interface FeatureEntity {
    id:string;
}

class Feature extends NotifiableObject {
    private entity_:FeatureEntity = null;

    constructor(entity:FeatureEntity) {
        super();
        this.entity_ = entity;
        this.hovered = this.focused = false;
    }

    destroy() {
        this.trigger("die");
        this.entity_ = null;
    }

    get id():string {
        return this.entity_.id
    }

    focus(piece:any) {
        this.focused = !!piece;
    }

    hover(piece:any) {
        this.hovered = !!piece;
    }

    @NotifiableObject.property()
    hovered:boolean;

    @NotifiableObject.property()
    focused:boolean;

    get entity():FeatureEntity {
        return this.entity_;
    }

    _NEW_ARCH_LAYER_:boolean = true;
}

export default Feature;
