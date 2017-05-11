import { Injectable } from '@angular/core'
// import { NativeStorage } from '@ionic-native/native-storage';
import { Subject } from 'rxjs/Subject';

import { ApiClientService } from '../../../base';
import { DataManager } from '../../../base';
import { User } from '../data/user';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';
// declare var require: any;
// const localforage: LocalForage = require("localforage");
import * as localforage from 'localforage';


@Injectable()
export class UserService {
    private lastLoginUserKey = "lastLoginUser";

    Current: User
    Users: DataManager<User>;
    constructor(private apiClient: ApiClientService) {
        this.Current = new User();
        this.Users = new DataManager<User>();

    }
    // private nativeStorage: NativeStorage = new NativeStorage();
    private _idSource = new Subject<any>();
    idObservable = this._idSource.asObservable();
    login(username, password) {
        password = Md5.hashStr(password);
        let promise = this.apiClient.post(`api/User/login?username=${username}&password=${password}`, {})
            .then(user => {
                if (user) {
                    this.Current = <User>user;
                    this.Current.LastUpdateTime = new Date();
                    this.Current.logouted = false;
                    localforage.setItem(this.lastLoginUserKey, this.Current).catch(error => { console.log(error) });
                    this._idSource.next(this.Current.UserId);
                    this.resetAllUsers();
                }
                return user;
            })
        return promise;
    }


    get hasLogined() {
        return this.Current !== undefined && this.Current !== null && !this.Current.logouted
    }

    autoLogin() {
        return localforage.getItem(this.lastLoginUserKey).then(value => {
            console.log("autologin", value);
            let lastLogonUser = <User>value;
            if (lastLogonUser) {
                this.Current = lastLogonUser;
                if (lastLogonUser && !lastLogonUser.logouted) {
                    let lastLoginTime = moment(lastLogonUser.LastUpdateTime);
                    let now = moment(new Date());
                    if (lastLoginTime.add("days", 7) >= now) {
                        this.Current.LastUpdateTime = new Date();
                        localforage.setItem(this.lastLoginUserKey, this.Current);
                        this._idSource.next(this.Current.UserId);
                        this.resetAllUsers();
                        return true;
                    }
                }
            }
            console.log("autologin", false);
            return false;
        });
    }

    logout() {
        this.Current.logouted = true;
        localforage.setItem(this.lastLoginUserKey, this.Current).catch(error => { console.log(error) });

        this.Current = null;
        localforage.getItem(this.lastLoginUserKey).then(data => {
            console.log("logout", data);
        })
        // this.runLogoutAction();
    }

    loginCallbacks: Function[] = [];

    subjectLogin(callback: Function) {
        this.loginCallbacks.push(callback);
    }

    runLoginAction() {
        this.loginCallbacks.map((callback) => {
            callback();
        })
    }

    logoutCallbacks: Function[] = [];
    subjectLogout(callback: Function) {
        this.logoutCallbacks.push(callback);
    }

    runLogoutAction() {
        this.logoutCallbacks.map((callback) => {
            callback();
        })
    }

    resetAllUsers() {
        this.apiClient.get("api/User").then(result => {
            let users = [];

            result.map(item => {
                let user = new User();
                user.UserId = item.UserId;
                user.UserName = item.UserName;
                user.RealName = item.RealName;
                users.push(user);
            })

            this.Users.reset(users);
        })
    }
}