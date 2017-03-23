import {SearchResultItem} from './search-result-item';

export class ShipSearchResultItem extends SearchResultItem {

    constructor(data) {
        super(data);
    }

    init(data) {
        this.uid = data.ShipId;
        this.name = data.Name;
        this.type = data.ShipType;
        this.mmsi = data.MMSI;
    }
}