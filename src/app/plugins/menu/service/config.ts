import {OpaqueToken} from '@angular/core';

import {MenuItem} from '../data/menu-item';


export interface IMenuConfig {
    WidthThreshold: number;
    Menu: MenuItem;
}

export let Menu_Config = new OpaqueToken('menu.config');