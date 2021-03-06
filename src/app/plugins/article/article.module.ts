import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { ArticleHomePage } from './page/article-home.component';
import { ArticlePage } from './page/article.component';
import { WarningPage } from './page/warning.component';
import { LawPage } from './page/law-page.component';
import { LawHomePage } from './page/law-home.component'

import { ArtileListComponent } from './component/article-list.component';
import { ArticleCardListComponent } from './component/article-card-list.component';
import { ElegantSlideComponent } from './component/elegant-slide.component';


import { ArticleService } from './service/article.service';

import { LoadingModule } from '../loading';


@NgModule({
    id: "ArticleModule",
    declarations: [
        ArtileListComponent,
        ArticleCardListComponent,
        ArticleHomePage,
        ArticlePage,
        WarningPage,
        ElegantSlideComponent,
        LawPage,
        LawHomePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoadingModule,
        BaseModule
    ],
    exports: [
        ArticleHomePage,
        ElegantSlideComponent,
        LawHomePage
    ],
    entryComponents: [ArticleHomePage, ArticlePage, WarningPage, LawPage, LawHomePage],
    providers: [ArticleService],
})
export class ArticleModule { }