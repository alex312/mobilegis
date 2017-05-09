import { Component } from '@angular/core';

import { HomePage } from './home';

import { ShipDynamicPage } from '../../plugins/ship-dynamic';
import { LawHomePage } from '../../plugins/article';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = ShipDynamicPage;
  tab3Root: any = LawHomePage;

  constructor() {

  }
}
