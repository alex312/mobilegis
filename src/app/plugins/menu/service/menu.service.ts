import { Injectable, Inject } from '@angular/core';

import {MenuItem} from '../data/menu-item';
// import {MenuConfig} from '../../menu-config';
import {IMenuConfig, Menu_Config} from './config';

@Injectable()
export class MenuService {
    private _colCount: number = 3;
    private _width: number;
    constructor( @Inject(Menu_Config) _menuConfig: IMenuConfig) {
        this._width = _menuConfig.WidthThreshold;
    }
    Grouping(items: MenuItem[], group: MenuItem[][]) {
        let rowCount: number = Math.ceil(items.length / this._colCount);
        for (let i = 0; i < rowCount; i++) {
            let start: number = i * this._colCount;
            let end: number = start + this._colCount;
            if (end > items.length)
                end = items.length;
            group.push(items.slice(start, end));
        }
    }
    SelectIconSize() {
        return window.innerWidth < this._width ? '2' : '3';
    }
}