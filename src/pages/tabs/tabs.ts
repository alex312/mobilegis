import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';

import { ShipDynamicPage } from '../../app/plugins/ship-dynamic';
import { UserSettingPage } from '../../app/plugins/user';
import { LawPage } from '../../app/plugins/article';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ShipDynamicPage;
  tab3Root: any = LawPage;
  tab4Root: any = UserSettingPage;

  constructor() {

  }
}
