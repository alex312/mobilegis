import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Config } from '../../../config';

import { ArticleService } from '../service/article.service';

@Component({
    selector: 'elegant-slide',
    templateUrl: './elegant-slide.component.html'
})
export class ElegantSlideComponent implements OnInit {
    slideItems = [
    ]


    constructor(private _articleService: ArticleService) {
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
    slidesAutoPlay() {
        setTimeout(() => {
            if (this._userDrag === false) {
                this._slideIndex++;
                if (this._slideIndex === this.slideItems.length)
                    this._slideIndex = 0;
                this.slides.slideTo(this._slideIndex)

                this.slidesAutoPlay();
            }
        }, 3000);
    }

    slideChange(event: Slides) {
        this._slideIndex = event.getActiveIndex();
        if (this._userDrag === true) {
            setTimeout(() => {
                this._userDrag = false;
                this.slidesAutoPlay();
            }, 15000);
        }
    }

    slideDrag(event) {
        this._userDrag = true;
    }
}