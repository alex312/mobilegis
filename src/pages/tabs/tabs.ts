import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';

import { MapPage } from '../../app/plugins/map'

import { ShipDynamicPage } from '../../app/plugins/ship-dynamic';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ShipDynamicPage;
  tab3Root: any = ContactPage;
  tab4Root: any = MapPage;

  constructor() {

  }
}
