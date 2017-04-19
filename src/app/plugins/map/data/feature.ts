import { ShipSummary } from '../../ship';
import { TrafficEnvSummary } from '../../traffic-env';

export enum FeatureType {
    Ship,
    TrafficEnv,
}

export class Feature {
    type;
    summary: any;
    constructor(public layerType: string, public data: any) {
        this.type = this.mapToFeatureType(layerType);
        this.summary = this.mapToSummary(this.type, data);
    }
    get id() {
        return this.type === FeatureType.Ship ? this.data.id : this.data.Id;
    }
    mapToFeatureType(layerType: string) {
        if (layerType === 'shipLayer')
            return FeatureType.Ship;
        else if (layerType === 'thhj')
            return FeatureType.TrafficEnv;
        else
            return undefined;
    }

    mapToSummary(featureType: FeatureType, data): any {
        if (featureType === FeatureType.Ship)
            return new ShipSummary(data);
        if (featureType === FeatureType.TrafficEnv) {
            return new TrafficEnvSummary(data);
        }
    }
}