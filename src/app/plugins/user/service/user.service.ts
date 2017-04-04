import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../base';
// import { Config } from '../../config';

@Injectable()
export class UserService {
    constructor(private _apiClient: ApiClientService) {

    }

    login(username: string, password: string) {
        return this._apiClient.post("api/user/login", { username: username, password: password });
    }
}