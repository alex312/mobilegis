import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MenuItem } from '../data/menu-item';
import { IMenuConfig, Menu_Config } from '../service/config';
import { MenuUtil } from '../service/menu-util';

@Component({
    templateUrl: './menu-item.page.html'
})
export class MenuPage {
    Current: MenuItem;
    Children: MenuItem[][] = [];
    IconSize: string = '2';
    constructor(private _navCtrl: NavController, @Inject(Menu_Config) _menuConfig: IMenuConfig) {
        this.Current = _menuConfig.Menu;
        MenuUtil.Grouping(this.Current.SubMenuItems as MenuItem[], this.Children);
        this.IconSize = MenuUtil.SelectIconSize();
    }

    OpenPage(item: MenuItem) {
        this._navCtrl.push(item.Page, item);
    }
}