import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import { TabsPage } from './entry-page/tjvts';
import { TabsPage } from './entry-page/common';
import { Config } from './config';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage;

    constructor(platform: Platform) {
        platform.ready().then(() => {

            this.rootPage = TabsPage;

            Config.CORDOVA_READY = platform.is("cordova")
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            Splashscreen.hide();
        });
    }
}
