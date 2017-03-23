import {TrafficEnvTypes} from './traffic-env-types';

export class TrafficEnvSummary {
    constructor(data: any) {
        this.Name = data.Name;
        this.AliasName1 = data.AliasName1;
        this.AliasName2 = data.AliasName2;
        this.AttachmentGroupKey = data.AttachmentGroupKey;
        this.Comments = data.Comments;
        this.DrawingStyle = data.DrawingStyle;
        this.FullName = data.FullName;
        this.OrganizationId = data.OriganizationId;
        this.PortAreaId = data.PortAreaId;
        this.TrafficEnvType = TrafficEnvTypes.GetTypeLabel(data.TrafficEnvType);
    }
    Id: number;
    Name: string;
    AliasName1: string;
    AliasName2: string;
    AttachmentGroupKey: string;
    Comments: string;
    DrawingStyle: string;
    FullName: string;
    OrganizationId: number;
    PortAreaId: number;
    TrafficEnvType: number;
}
