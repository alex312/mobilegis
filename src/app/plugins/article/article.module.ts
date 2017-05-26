import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from 'ionic-angular';

import { BaseModule } from '../../base';

import { ArticleHomePage } from './page/article-home.component';
import { ArticlePage } from './page/article.component';
import { WarningPage } from './page/warning.component';
import { LawPage } from './page/law-page.component';
import { LawHomePage } from './page/law-home.component';
import { ElegantComponent } from './page/elegant.component';
import { WeatherPage } from './page/weather.component';

import { ArtileListComponent } from './component/article-list.component';
import { ArticleCardListComponent } from './component/article-card-list.component';
import { ElegantSlideComponent } from './component/elegant-slide.component';

import { IArticleConfig, Article_Config, dealConfig } from './service/config';
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
        LawHomePage,
        ElegantComponent,
        WeatherPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoadingModule,
        BaseModule
    ],
    exports: [
        ElegantSlideComponent,
        ArtileListComponent,
    ],
    entryComponents: [ArticleHomePage, ArticlePage, WarningPage, LawPage, LawHomePage, ElegantComponent, WeatherPage],
})
export class ArticleModule {
    static forRoot(articleConfig: IArticleConfig): ModuleWithProviders {

        return {
            ngModule: ArticleModule,
            providers: [
                { provide: Article_Config, useValue: dealConfig(articleConfig) },
                ArticleService
            ]
        }

    }

}