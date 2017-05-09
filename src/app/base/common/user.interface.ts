export interface IUser {
    UserId: number; // Id
    UserName: string; // 名称
    RealName: string; // 真实姓名
    Role: number[]; // 人员权限
}