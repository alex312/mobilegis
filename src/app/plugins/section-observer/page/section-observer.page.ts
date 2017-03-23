import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';

import { SectionObserver } from '../data/section-observer';
import { SectionObserverService } from '../service/section-observer.service';
import { SectionObserverChartPage } from './section-observer-chart.page';

@Component({
    templateUrl: './section-observer.page.html',
})
export class SectionObserverPage implements OnInit {
    SectionObservers: SectionObserver[] = [];
    private _loading: Loading;
    constructor(private _navCtrl: NavController, private _loadingCtrl: LoadingController, private _sectionObserverService: SectionObserverService) { }
    ngOnInit() {
        this.startLoading();
        this._sectionObserverService.GetSectionObservers().then(p => {
            this.SectionObservers = p;
            this.stopLoading();
        }).catch(errMsg => {
            console.log(errMsg);
            this.stopLoading();
        });
    }
    private startLoading() {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    }
    private stopLoading() {
        this._loading.dismiss();
    }
    Refresh(refresher) {
        this._sectionObserverService.GetSectionObservers().then(p => {
            this.SectionObservers = p;
            refresher.complete();
        }).catch(errMsg => {
            console.log(errMsg);
            refresher.complete();
        });
    }
    GotoChart(section: SectionObserver) {
        this._navCtrl.push(SectionObserverChartPage, section);
    }
}