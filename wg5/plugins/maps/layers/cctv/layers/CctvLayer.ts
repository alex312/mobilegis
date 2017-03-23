import * as ol from "openlayers";
import * as utils from "seecool/geom/utils";

import {ExtendFeature} from "seecool/StaticLib";

class VectorLayer extends ol.layer.Vector {
    constructor(options) {
        super(options);
    }

    pickup (coordinate, maxOffset, res) {

        var features = this.getSource().getFeatures();
        var mindistance = Infinity;
        var feature;
        for (var i in features) {
            var I = features[i];
            var df = [0, 0];
            var testg = I.getGeometry();
            testg.getClosestPoint([coordinate[0], coordinate[1]], df);
            var distance = utils.squaredDistance(coordinate[0], coordinate[1], df[0], df[1]);
            if (mindistance > distance) {
                mindistance = distance;
                feature = I;
            }
            if (mindistance == 0)break;
        }
        return {feature: feature, distance: mindistance};
    };

    getFeatureById (id) {
        var features:ExtendFeature = <ExtendFeature><any>this.getSource().getFeatures();
        for (var i in features) {
            if (features[i].id == id)return features[i];
        }
        return null;
    };

    searchDatas (key) {
        var r = [];
        var features = this.getSource().getFeatures();
        //name
        for (var each in features) {
            var I = (<ExtendFeature><any>features[each]).data;
            if (this.searchString(I.Name, key)) {
                r.push({type: "name", data: I.Name, target: features[each]});
            }
        }
        return r;
    }
    searchString (thestring, str) {
        var r = false;
        var t = thestring.toLowerCase().replace(/\s/g, "");
        var k = str.toLowerCase();
        r = r ? r : (t.indexOf(k) >= 0);
        return r;
    }
}
export default VectorLayer;
