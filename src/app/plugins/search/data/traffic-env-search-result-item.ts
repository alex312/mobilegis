import {SearchResultItem} from './search-result-item';

export class TrafficEnvSearchResultItem extends SearchResultItem {
    uid: string;
    name: string;
    type: string;
    constructor(data) {
        super(data);
    }

    init(data) {
        this.uid = data.Id;
        this.name = data.Name;
        this.type = data.TrafficEnvType;
    }
}