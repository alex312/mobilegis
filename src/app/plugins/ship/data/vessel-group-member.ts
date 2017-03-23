export class VesselGroupMember {
    Id: number;
    GroupId: number;
    MMSI: string;
    LocalName: string;
    EnName: string;
    Comment: string;
    constructor(data: any) {
        this.Id = data.Id;
        this.GroupId = data.GroupId;
        this.MMSI = data.MMSI;
        this.LocalName = data.LocalName;
        this.EnName = data.EnName;
        this.Comment = data.Comment;
    }
    get Name(): string {
        let name = '';
        if (this.LocalName) {
            name = this.LocalName;
            if (this.EnName)
                name += `(${this.EnName})`;
        }
        else if (this.EnName)
            name = this.EnName;
        else
            name = this.MMSI;
        return name;
    }
}