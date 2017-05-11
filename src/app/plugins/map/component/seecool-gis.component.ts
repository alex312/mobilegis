import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

import { MapHolderImp } from '../service/map-holder';


@Component({
    selector: 'mobile-app',
    templateUrl: './seecool-gis.component.html',
})
export class SeecoolGISComponent implements OnInit, OnDestroy {

    holder = null;
    map: HTMLElement = null;
    destroyed = false;

    @ViewChild('map') dom: ElementRef
    constructor(
        private zone: NgZone, private renderer: Renderer) {

    }
    ngOnInit() {
        console.log("init", this.dom.nativeElement.offsetWidth, this.dom.nativeElement.offsetHeight)
        MapHolderImp.createHolder();
        MapHolderImp.holder.then(((holder) => {
            if (!this.destroyed) {
                this.holder = holder;
                let mapContainer = <HTMLElement>holder.mapContainer;
                this.map = <HTMLElement>mapContainer.childNodes[0];
                console.log("creater", this.map.offsetWidth, this.map.offsetHeight);
                mapContainer.removeChild(this.map);
                this.dom.nativeElement.appendChild(this.map);
                console.log("added", this.map.offsetWidth, this.map.offsetHeight);
            }
        }).bind(this));

    }


    ngOnDestroy() {

        this.destroyed = true;
        if (this.holder) {
            this.dom.nativeElement.removeChild(this.map);
            (<HTMLElement>this.holder.mapContainer).appendChild(this.map);
        }

    }

}
