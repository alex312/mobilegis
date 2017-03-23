import { Component, Input } from '@angular/core';

import { Feature, FeatureType } from '../data/feature';

@Component({
    selector: 'feature-info',
    templateUrl: './feature-info.component.html',

})
export class FeatureInfoComponent {
    @Input()
    FeatureData: Feature;
    FeatureType = FeatureType;
    constructor() { }
}