import { Component, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { } from 'ionic-angular';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html'
})
export class LoadingComponent {
    private _timeout: number;
    @Input()
    set timeout(value: number) {
        this._timeout = value;
    }
    get timeout() {
        return this._timeout;
    }

    private _enable;
    get enable() {
        return this._enable;
    }
    @Input()
    set enable(value) {
        this._enable = value;
        if (this._enable === true) {
            this.show();
            setTimeout(() => {
                this.timeouted();
            }, this.timeout);
        }
        else {
            this.hide();
        }
    }

    private _loadingPromise: Promise<any>;
    @Input()
    set loadingPromise(value: Promise<any>) {
        this._loadingPromise = value;
    }
    get loadingPromise() {
        return this._loadingPromise;
    }

    @Output()
    onTimeout: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _elementRef: ElementRef,
        private _renderer: Renderer) {
        _renderer.setElementStyle(_elementRef.nativeElement, "width", "100%");
        _renderer.setElementStyle(_elementRef.nativeElement, "height", "100%");
        this.hide();
    }


    // loading() {
    //     if (this.loadingPromise === undefined || this.loadingPromise === null)
    //         return;
    //     this.show();
    //     this.loadingPromise.then(result => {
    //         this.successed(result);
    //     })
    //     setTimeout(() => {
    //         this.timeouted();
    //     }, this.timeout);
    // }

    private timeouted() {
        this.hide();
        this.onTimeout.emit();
    }

    private show() {
        this._renderer.setElementStyle(this._elementRef.nativeElement, "display", "block");
    }

    private hide() {
        this._renderer.setElementStyle(this._elementRef.nativeElement, "display", "none");
    }

}