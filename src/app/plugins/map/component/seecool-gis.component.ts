import { Component, NgZone, OnInit, AfterViewInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';

import { MapHolderImp } from '../service/map-holder';


@Component({
    selector: 'mobile-app',
    templateUrl: './seecool-gis.component.html',
})
export class SeecoolGISComponent implements OnInit, OnDestroy, AfterViewInit {

    holder = null;
    map: Node = null;
    destroyed = false;

    @ViewChild('map') dom: any
    constructor(
        private elementRef: ViewContainerRef,
        private zone: NgZone) {

    }
    ngOnInit() {
        MapHolderImp.createHolder();
        MapHolderImp.holder.then(((holder) => {
            if (!this.destroyed) {
                this.holder = holder;
                let mapContainer = <HTMLElement>holder.mapContainer;
                this.map = mapContainer.childNodes[0];
                mapContainer.removeChild(this.map);
                this.dom.nativeElement.appendChild(this.map);
                setTimeout(() => { this.holder.tool.map.UpdateSize(); }, 300);
                // this.holder.tool.map.UpdateSize();
            }
        }).bind(this));

    }
    ngAfterViewInit() {
        if (window['map'])
            window['map'].map.updateSize();
    }

    ngOnDestroy() {

        this.destroyed = true;
        if (this.holder) {
            this.dom.nativeElement.removeChild(this.map);
            (<HTMLElement>this.holder.mapContainer).appendChild(this.map);
        }

    }
}
