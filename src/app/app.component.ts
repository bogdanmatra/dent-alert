import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { ListMasterPage } from '../pages/list-master/list-master';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';

import { Settings } from '../providers/providers';

import { TranslateService } from '@ngx-translate/core'

import { Storage } from '@ionic/storage';

import { User } from '../providers/user';


@Component({
  templateUrl: 'sidebar.html'
})
export class MyApp {
  //rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: TutorialPage },
    { title: 'Welcome', component: WelcomePage, loggedIn: false },
    { title: 'Tabs', component: TabsPage, loggedIn: "doctor"  },
    { title: 'Cards', component: CardsPage, loggedIn: "doctor"  },
    { title: 'Content', component: ContentPage, loggedIn: "doctor"  },
    { title: 'Map', component: MapPage, loggedIn: "doctor"  },
    { title: 'Master Detail', component: ListMasterPage, loggedIn: "doctor"  },
    { title: 'Menu', component: MenuPage, loggedIn: "pacient"  },
    { title: 'Settings', component: SettingsPage, loggedIn: "pacient"  },
    { title: 'Search', component: SearchPage, loggedIn: "pacient"  }
  ]

  constructor(private translate: TranslateService, private platform: Platform,
              settings: Settings, private config: Config, private statusBar: StatusBar,
              private splashScreen: SplashScreen, private storage: Storage,
              public user: User) {
    this.initTranslate();

    storage.get('doNotShowTutorial').then((val) => {
      if (val) {
        user.getUser().subscribe((user) => {
          if (user) {
            this.nav.setRoot(TabsPage);
          } else {
            this.nav.setRoot(WelcomePage);
          }
        });
      } else {
        this.nav.setRoot(TutorialPage);
      }
    });

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('ro');

    // TODO Default to browser language, use romanian for the moment
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
      this.translate.use('ro'); // Set your language here
    // }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.user.logout();
    this.nav.setRoot(WelcomePage);
  }

}
