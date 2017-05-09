import { Component } from '@angular/core';

import { App } from 'ionic-angular';

import { ArticleHomePage, ARTICLE_TYPES } from '../../plugins/article';

import { MapPage } from '../../plugins/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  articleTypes = ARTICLE_TYPES;
  constructor(
    private _app: App) {

  }

  showArticle(event, category) {
    this._app.getRootNav().push(ArticleHomePage, category);
  }

  showMap() {
    this._app.getRootNav().push(MapPage);
  }
}


