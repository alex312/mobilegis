import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from 'ionic-angular';

import { ApiClientService } from '../../base';

import { ArticleHomePage } from './page/article-home.component';
import { ArticlePage } from './page/article.component';
import { WarningPage } from './page/warning.component';
import { LawPage } from './page/law-page.component';

import { ArtileListComponent } from './component/article-list.component';
import { ArticleCardListComponent } from './component/article-card-list.component';
import { ElegantSlideComponent } from './component/elegant-slide.component';

import { ArticleService } from './service/article.service';


@NgModule({
    declarations: [
        ArtileListComponent,
        ArticleCardListComponent,
        ArticleHomePage,
        ArticlePage,
        WarningPage,
        ElegantSlideComponent,
        LawPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        ArticleHomePage,
        LawPage,
        ElegantSlideComponent
    ],
    entryComponents: [ArticleHomePage, ArticlePage, WarningPage, LawPage],
    providers: [ArticleService, ApiClientService],
})
export class ArticleModule { }