import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'item-button',
    templateUrl: './item-button.component.html'
})
export class ItemButtonComponent {

    private backImage: string;
    private _image: string;
    @Input()
    set image(src: string) {
        this._image = src;
        this.resetBackgroundImage();
    }
    get image() {
        return this._image;
    }
    private _useIcon: boolean = false;
    @Input()
    set useIcon(flag: boolean) {
        this._useIcon = flag;
        this.resetBackgroundImage();
    }
    get useIcon() {
        return this._useIcon;
    }
    @Input()
    iconName: string;

    @Input()
    text: string;

    @Output()
    click: EventEmitter<any> = new EventEmitter();

    resetBackgroundImage() {
        if (this.useIcon || !this._image || this.image.length === 0)
            this.backImage = "none";
        else
            this.backImage = `url("${this._image}")`;
    }

    onClick() {
        this.click.emit(null);
    }

}