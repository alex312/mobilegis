import * as ol from "openlayers";
import * as utils from 'seecool/geom/utils';

class VectorLayer extends ol.layer.Vector {
    constructor(options?) {
        super(options);
    }

    pickup(coordinate, maxOffset, res) {
        var mindistance = Infinity;
        var feature;
        var source = this.getSource();
        source.forEachFeature(function (F) {
            var df = [0, 0];
            var testg = F.getGeometry();
            testg.getClosestPoint([coordinate[0], coordinate[1]], df);
            var distance = utils.squaredDistance(coordinate[0], coordinate[1], df[0], df[1]);
            if (mindistance > distance) {
                mindistance = distance;
                feature = F;
            }
            if (mindistance == 0)return true;
        })
        return {feature: feature, distance: mindistance};
    };

    getFeatureById(id) {
        var feature = null;
        var source = this.getSource();
        source.forEachFeature(function (F) {
            if (F.id == id) {
                feature = F;
                return true;
            }
        });
        return feature;
    };

    searchDatas(key) {
        var r = [];
        var source = this.getSource();
        source.forEachFeature(function (F) {
            var I = F.data;
            if (this.searchString(I.Name, key)) {
                r.push({type: "name", data: I.Name, target: F});
            }
        });
        return r;
    }

    searchString(thestring, str) {
        var r = false;
        var t = thestring.toLowerCase().replace(/\s/g, "");
        var k = str.toLowerCase();
        r = r ? r : (t.indexOf(k) >= 0);
        return r;
    }
}
export default VectorLayer;
