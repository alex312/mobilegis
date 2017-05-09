import { Component } from '@angular/core';

import { HomePage } from './home.page';

import { ShipDynamicPage } from '../../plugins/ship-dynamic';
import { UserSettingPage } from '../../plugins/user';
import { LawHomePage } from '../../plugins/article';

@Component({
    templateUrl: 'tabs.page.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = HomePage;
    tab2Root: any = ShipDynamicPage;
    tab3Root: any = LawHomePage;
    tab4Root: any = UserSettingPage;

    constructor() {

    }
}
