import { IUser } from "../../../../base";
import { Member } from "../../data/member";

export class MemberConverter {
    toMember(user: IUser) {
        let member = new Member();
        member.UserId = user.UserId;
        member.UserName = user.RealName;
        member.Role = user.Role;
        return member;
    }
} 