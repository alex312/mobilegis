import { Component, ViewChild } from '@angular/core';
import { Tabs, App, Tab } from 'ionic-angular';

import { HomePage } from './home';

import { ShipDynamicPage } from '../../plugins/ship-dynamic';
import { UserSettingPage, UserService, UserLoginPage } from '../../plugins/user';
import { LawHomePage } from '../../plugins/article';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = ShipDynamicPage;
  tab3Root: any = LawHomePage;
  tab4Root: any = UserSettingPage;

  @ViewChild(Tabs)
  private tabs: Tabs;

  constructor(
    private _user: UserService,
    private _app: App
  ) {

  }

  checkNeedLogin(tab: Tab) {
    if (this._user.hasLogined)
      return;
    let currentTabIndex = this.tabs.getIndex(tab);
    if (currentTabIndex === 2) {
      let previousTab = this.tabs.previousTab(false);
      this.tabs.select(previousTab);

      this._user.autoLogin().then((result) => {
        if (!result)
          this._app.getRootNav().push(UserLoginPage, {
            loginSuccess: () => {
              this.tabs.select(tab);
            },
            cancelLogin: () => {
              // this.tabs.select(previousTab);
            }
          });
        else {
          this.tabs.select(tab);
          this._user.runLoginAction();
        }
      }).catch(error => {
        console.log(error)
      });
    }
  }
}
