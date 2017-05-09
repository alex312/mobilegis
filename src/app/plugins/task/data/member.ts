import { Group } from './group';

export class Member {
    UserId: number; // Id
    UserName: string; // 名称
    RealName: string;
    Group: Group; // 所属执法队
    IsGroupLeader: boolean; // 是否是队长 
    Role: number[]; // 人员权限
}
