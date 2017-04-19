import { Component, Input, ElementRef } from '@angular/core';

import { Feature, FeatureType } from '../data/feature';

@Component({
    selector: 'feature-info',
    templateUrl: './feature-info.component.html',

})
export class FeatureInfoComponent {
    @Input()
    FeatureData: Feature;
    FeatureType = FeatureType;

    get offsetWidth() {
        return this._elementRef.nativeElement.offsetWidth;
    }
    get offsetHeight() {
        return this._elementRef.nativeElement.offsetHeight;
    }
    constructor(private _elementRef: ElementRef) { }
}