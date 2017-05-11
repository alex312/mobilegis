import { Injectable } from '@angular/core'
import { ApiClientService, DataManager } from '../../../base';
import { Member } from '../data/member';

import { UserService } from '../../user';

@Injectable()
export class MembersService {

    allMembers: DataManager<Member> = new DataManager<Member>();

    constructor(
        private apiClient: ApiClientService,
        private user: UserService
    ) {
        user.subjectLogin(this.init.bind(this));
    }

    init() {
        this.getAllMembers().then((members) => {
            this.DataManager.reset(members);
        })
    }
    private url = "api/User";
    getAllMembers() {
        let promise = this.apiClient.get(this.url).then((users) => {
            let members: Member[] = [];
            users.map((user) => {
                let member = new Member();
                member.UserId = user.UserId;
                member.UserName = user.UserName;
                member.RealName = user.RealName
                members.push(member);
            });
            return members;
        });
        return promise;
    }

    get DataManager() {
        return this.allMembers;
    }
}

