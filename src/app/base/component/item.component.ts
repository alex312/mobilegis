import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { ItemButtonComponent } from './item-button.component';

@Component({
    selector: 'item',
    templateUrl: './item.component.html',
})
export class ItemComponent implements AfterContentInit {
    @Input()
    label: string;
    @Input()
    value: any;

    @ContentChildren(ItemButtonComponent)
    itemButtons: QueryList<ItemButtonComponent>;
    constructor() {

    }

    ngAfterContentInit() {

    }
}
