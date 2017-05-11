import { IUser } from '../../../base';

export class User implements IUser {

    UserId: number; // Id
    UserName: string; // 名称
    RealName: string; // 真实名称
    Role: number[]; // 人员权限

    LastUpdateTime: Date;
    logouted: boolean = true;
}
