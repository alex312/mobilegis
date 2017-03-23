import { Component, Input } from '@angular/core'

import { NavController } from 'ionic-angular';


import { MenuItem } from '../';
import { MenuUtil } from '../service/menu-util';


@Component({
    selector: 'menu-content',
    templateUrl: './menu-content.component.html'
})
export class MenuContentComponent {
    // TODO:先作为menu实现，在从中将menu item的部分重构出去
    _items: MenuItem[][] = [];
    @Input() set items(val: MenuItem[]) {
        MenuUtil.GroupingWithColCount(val, this._items, 2);
    }

    iconSize: string = "2";

    constructor(private _navCtrl: NavController) {
        this.iconSize = MenuUtil.SelectIconSize();
    }

    openPage(cell: MenuItem) {
        this._navCtrl.push(cell.Page, cell.Params);
    }
}