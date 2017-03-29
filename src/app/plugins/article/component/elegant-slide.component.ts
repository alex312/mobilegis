import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Config } from '../../../config';

import { ArticleService } from '../service/article.service';

@Component({
    selector: 'elegant-slide',
    templateUrl: './elegant-slide.component.html'
})
export class ElegantSlideComponent implements OnInit {
    slideItems = []

    constructor(private _articleService: ArticleService) {
        _articleService.getElegant().then(result => {
            result.forEach(item => {
                item.url = Config.proxy + "api/elegant/images/" + item.url;
            })
            this.slideItems.splice(0, this.slideItems.length, ...result);
        })
    }

    get paginationContainerHeight() {
        if (this.slides._paginationContainer)
            return this.slides._paginationContainer.offsetHeight + "px";
        return "0px";
    }

    ngOnInit() {
        this.slidesAutoPlay();
    }

    @ViewChild(Slides) slides: Slides;
    slidesAutoPlay() {
        this.slides.startAutoplay();
    }
}