import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MenuItem } from '../data/menu-item';
import { MenuUtil } from '../service/menu-util';

@Component({
    templateUrl: './menu-item.page.html'
})
export class MenuItemPage {
    Children: MenuItem[][] = [];
    Current: MenuItem;
    IconSize: string = '2';
    constructor(private _navCtrl: NavController, private _navParams: NavParams) {
        this.Current = this._navParams.data;
        MenuUtil.Grouping(this.Current.SubMenuItems, this.Children);
        this.IconSize = MenuUtil.SelectIconSize();
    }

    OpenPage(item: MenuItem) {
        this._navCtrl.push(item.Page, item);
    }
}