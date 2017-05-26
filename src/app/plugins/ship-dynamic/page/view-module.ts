import { Type } from '@angular/core';

import { AnchorStateCardComponent } from '../component/anchor/anchor-state-card.component';
import { BerthStateCardComponent } from '../component/berth/berth-state-card.component';
import { PortVisitCardComponent } from '../component/port-visit/port-visit-card.component';
import { RawBoatDynamicCardComponent } from '../component/raw-boat/raw-boat-dynamic-card.component';
import { VesselDynamicCardComponent } from '../component/vessel/vessel-dynamic-card.component';

import { AnchorStateDetailComponent } from '../component/anchor/anchor-state-detail.component';
import { BerthStateDetailComponent } from '../component/berth/berth-state-detail.component';
import { PortVisitDetailComponent } from '../component/port-visit/port-visit-detail.component';
import { RawBoatDynamicDetailComponent } from '../component/raw-boat/raw-boat-dynamic-detail.component';
import { VesselDynamicDetailComponent } from '../component/vessel/vessel-dynamic-detail.component';

import { IAnchorState, createAnchorState } from '../data/anchor-state';
import { IBerthState, createBerthState } from '../data/berth-state';
import { IPortVisit, createPortVisit } from '../data/port-visit';
import { IRawBoatDynamic, createRawBoatDynamic } from '../data/raw-boat-dynamic';
import { IVesselDynamic, createVesselDynamic } from '../data/vessel-dynamic';
import { IConstructor } from '../data/common-data';

interface ShipDynamicCardViewModule {
    group: string;
    data: any;
    viewDetail: () => void;
}

abstract class CardSelectorFactory<T> implements ICardSelectorFactory {
    constructor() {

    }

    createSelector = (data: any): ICardSelectorInfo => {
        let dataObject: T = this.createDataObject(data);
        return {
            card: this.cardComponent,
            detail: this.detailComponent,
            sortItem: this.sortItem(dataObject),
            cardViewModule: this.createCardViewModule(dataObject)
        }
    }

    protected abstract readonly cardComponent: Type<any>;
    protected abstract readonly detailComponent: Type<any>;
    protected abstract sortItem: (T) => any;
    protected abstract createCardViewModule: (T) => ShipDynamicCardViewModule;
    protected abstract createDataObject: (any) => T;
}

class AnchorCardSelectorFactory extends CardSelectorFactory<IAnchorState>{

    protected readonly cardComponent: Type<any> = AnchorStateCardComponent;
    protected readonly detailComponent: Type<any> = AnchorStateDetailComponent;
    protected sortItem = (anchor: IAnchorState) => anchor.AnchorTime;
    protected createCardViewModule = (anchor: IAnchorState): ShipDynamicCardViewModule => {
        return <ShipDynamicCardViewModule>{
            group: "锚泊",
            data: anchor
        };
    }
    protected createDataObject = (data: any) => createAnchorState(data);

}

class BerthCardSelectorFactory extends CardSelectorFactory<IBerthState>{

    protected readonly cardComponent: Type<any> = BerthStateCardComponent;
    protected readonly detailComponent: Type<any> = BerthStateDetailComponent;
    protected sortItem = (berth: IBerthState) => berth.BerthTime;
    protected createCardViewModule = (berth: IBerthState): ShipDynamicCardViewModule => {
        return <ShipDynamicCardViewModule>{
            group: "靠泊",
            data: berth
        };
    }
    protected createDataObject = (data: any) => createBerthState(data);

}

class PortVisitCardSelectorFactory extends CardSelectorFactory<IPortVisit>{

    protected readonly cardComponent: Type<any> = PortVisitCardComponent;
    protected readonly detailComponent: Type<any> = PortVisitDetailComponent;
    protected sortItem = (portVisit: IPortVisit) => portVisit.StartTime;
    protected createCardViewModule = (portVisit: IPortVisit): ShipDynamicCardViewModule => {
        return <ShipDynamicCardViewModule>{
            group: "预确报",
            data: portVisit
        };
    }
    protected createDataObject = (data: any) => createPortVisit(data);

}

class RawBoatDynamicCardSelectorFactory extends CardSelectorFactory<IRawBoatDynamic>{

    protected readonly cardComponent: Type<any> = RawBoatDynamicCardComponent;
    protected readonly detailComponent: Type<any> = RawBoatDynamicDetailComponent;
    protected sortItem = (rawBoatDynamic: IRawBoatDynamic) => rawBoatDynamic.PlanTime;
    protected createCardViewModule = (rawBoatDynamic: IRawBoatDynamic): ShipDynamicCardViewModule => {
        return <ShipDynamicCardViewModule>{
            group: "小船计划",
            data: rawBoatDynamic
        };
    }
    protected createDataObject = (data: any) => createRawBoatDynamic(data);
}

class VesselDynamicCardSelectorFactory extends CardSelectorFactory<IVesselDynamic>{

    protected readonly cardComponent: Type<any> = VesselDynamicCardComponent;
    protected readonly detailComponent: Type<any> = VesselDynamicDetailComponent;
    protected sortItem = (vesselDynamic: IVesselDynamic) => vesselDynamic.PlanTime;
    protected createCardViewModule = (vesselDynamic: IVesselDynamic): ShipDynamicCardViewModule => {
        return <ShipDynamicCardViewModule>{
            group: "商业船舶计划",
            data: vesselDynamic
        };
    }
    protected createDataObject = (data: any) => createVesselDynamic(data);
}
const createCardSelectorFactory = <T>(factory: IConstructor): ICardSelectorFactory => {
    return new factory<ICardSelectorFactory>();
}


export interface ICardSelectorInfo {
    card: Type<any>;
    detail: Type<any>;
    sortItem: Date;
    cardViewModule: ShipDynamicCardViewModule;
}

export interface ICardSelectorFactory {
    createSelector: (any) => ICardSelectorInfo
}

export const CardSelectorFactorys = {
    VesselDynamic: createCardSelectorFactory(VesselDynamicCardSelectorFactory),
    RawBoatDynamic: createCardSelectorFactory(RawBoatDynamicCardSelectorFactory),
    PortVisit: createCardSelectorFactory(PortVisitCardSelectorFactory),
    Berth: createCardSelectorFactory(BerthCardSelectorFactory),
    Anchor: createCardSelectorFactory(AnchorCardSelectorFactory)
}

