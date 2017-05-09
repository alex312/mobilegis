import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { SearchPage } from './page/search.page';

import { LoadingModule } from '../loading';

@NgModule({
    id: "SearchModule",
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoadingModule
    ],
    exports: [
        SearchPage
    ],
    entryComponents: [
        SearchPage
    ],
    declarations: [
        SearchPage
    ],
    providers: [],
})
export class SearchModule {

}