export class NearbyShip {
    ID: string;
    MMSI: string;
    Name: string;
    NameCN: string;
    constructor(data: any) {
        this.ID = data.ID;
        this.MMSI = data.MMSI;
        this.Name = this.getStringTrim(data.Name);
        this.NameCN = this.getStringTrim(data.NameCN);
    }
    get DisplayName(): string {
        if (this.NameCN && this.NameCN.length > 0)
            return this.NameCN;
        else
            return this.MMSI;
    }
    getStringTrim(str: any) {
        if (str)
            return str.trim();
        else
            return undefined;
    }
}