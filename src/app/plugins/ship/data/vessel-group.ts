import {VesselGroupMember} from './vessel-group-member';

export class VesselGroup {
    Id: number;
    Name: string;
    GroupType: number;
    Param: string;
    Fill: string;
    Members: VesselGroupMember[] = [];
    constructor(data: any) {
        this.Id = data.Id;
        this.Name = data.Name;
        this.GroupType = data.GroupType;
        this.Param = data.Param;
        this.Fill = data.Fill;
        data.Members.forEach(p => {
            let member: VesselGroupMember = new VesselGroupMember(p);
            this.Members.push(member);
        });
    }
    get FillColor(): string {
        if (this.Fill)
            return '#' + this.Fill.substring(3);
        else
            return '#222';
    }
}