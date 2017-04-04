import { Component } from '@angular/core'

import { UserService } from '../service/user.service';

@Component({
    selector: "login-page",
    templateUrl: "./user-login.component"
})
export class LoginPage {
    constructor(private _userService: UserService) {

    }


}