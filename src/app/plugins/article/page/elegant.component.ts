import { Component } from '@angular/core';
import { NavParams, Slides } from 'ionic-angular';
import { isPresent, isNumber } from '../../../base';

@Component({
    selector: 'elegant-page',
    templateUrl: './elegant.component.html'
})
export class ElegantComponent {
    private slideItems = [];
    private item;
    constructor(private _navParam: NavParams) {
        if (isPresent(this._navParam.data)) {
            this.item = this._navParam.data;
        }
    }

    get content() {
        if (isPresent(this.item))
            return this.item.content;
    }

    get imgUrl() {
        return "url(" + this.item.url + ")";
    }
}