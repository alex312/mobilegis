import {MenuItem} from '../data/menu-item';
import {MenuConfig} from '../../../menu-config';

export class MenuUtil {
    private static _colCount: number = 3;
    static Grouping(items: MenuItem[], group: MenuItem[][]) {
        let rowCount: number = Math.ceil(items.length / this._colCount);
        for (let i = 0; i < rowCount; i++) {
            let start: number = i * this._colCount;
            let end: number = start + this._colCount;
            if (end > items.length)
                end = items.length;
            group.push(items.slice(start, end));
        }
    }

    static GroupingWithColCount(items: MenuItem[], group: MenuItem[][], colCount: number = 3) {
        let rowCount: number = Math.ceil(items.length / colCount);
        for (let i = 0; i < rowCount; i++) {
            let start: number = i * colCount;
            let end: number = start + colCount;
            if (end > items.length)
                end = items.length;
            group.push(items.slice(start, end));
        }
    }

    static SelectIconSize() {
        return window.innerWidth < MenuConfig.WidthThreshold ? '2' : '3';
    }
}