import { Component, Input } from '@angular/core';

@Component({
    selector: 'item-label',
    templateUrl: './item-label.component.html'
})
export class ItemLabelComponent {
    @Input()
    label: string;
    @Input()
    value: any;
    @Input()
    imgSrc: string;

    constructor() {
    }
}
