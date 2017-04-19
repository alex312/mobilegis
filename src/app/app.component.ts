import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { Config } from './config';

// import { MenuPage } from './plugins/menu';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage;//= TabsPage;

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
