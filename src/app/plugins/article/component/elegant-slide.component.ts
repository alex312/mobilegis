import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides, App } from 'ionic-angular';

import { isBlank } from '../../../base';
import { Config } from '../../../config';

import { ArticleService } from '../service/article.service';

import { ElegantComponent } from '../page/elegant.component';

@Component({
    selector: 'elegant-slide',
    templateUrl: './elegant-slide.component.html'
})
export class ElegantSlideComponent implements OnInit {
    slideItems = []

    constructor(private _articleService: ArticleService, private _app: App) {
        this._articleService.getElegant().then(result => {
            result.forEach(item => {
                item.url = Config.proxy + "api/elegant/images/" + item.url;
            })
            this.slideItems.splice(0, this.slideItems.length, ...result);
            this.slidesAutoPlay();
        })
    }

    get paginationContainerHeight() {
        if (this.slides._paginationContainer)
            return this.slides._paginationContainer.offsetHeight + "px";
        return "0px";
    }

    ngOnInit() {

    }

    @ViewChild(Slides) slides: Slides;
    private _slideIndex = 0;
    private _userDrag = false;
    private interval: number;
    slidesAutoPlay() {
        this.interval = setInterval(() => {
            this._slideIndex++;
            if (this._slideIndex === this.slideItems.length)
                this._slideIndex = 0;
            this.slides.slideTo(this._slideIndex)
        }, 3000);
    }

    slideChange(event: Slides) {
        this._slideIndex = event.getActiveIndex();
    }

    private _timeout: number;
    slideDrag(event) {
        clearInterval(this.interval);
        if (isBlank(this._timeout)) {
            this._timeout = setTimeout(() => {
                this.slidesAutoPlay();
                clearTimeout(this._timeout);
                this._timeout = undefined;
            }, 12000);
        }
    }

    openSlideDetail(item) {
        this._app.getRootNav().push(ElegantComponent, item);
    }
}