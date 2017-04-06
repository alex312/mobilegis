import { Component } from '@angular/core'

import { UserService } from '../service/user.service';

@Component({
    selector: "login-page",
    templateUrl: "./user-login.component.html"
})
export class UserLoginPage {
    constructor(private _userService: UserService) {

    }


}