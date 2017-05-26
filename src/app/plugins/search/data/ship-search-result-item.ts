import { SearchResultItem } from './search-result-item';

export class ShipSearchResultItem extends SearchResultItem {

    constructor(data) {
        super(data);
    }

    init(data) {
        this.uid = data.ShipId;

        this.name = ""
        if (data.V_Name !== undefined && data.V_Name !== null && data.V_Name !== "")
            this.name = data.V_Name;
        else if (data.Name !== undefined && data.Name !== null && data.Name !== "")
            this.name = data.Name;
        if (this.name === "")
            this.name = data.MMSI;

        this.type = data.ShipType;
        this.mmsi = data.MMSI;
    }
}