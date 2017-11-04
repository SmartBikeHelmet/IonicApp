import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';

import { Lum } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateProfile } from '../pages/create-profile/create-profile';
import { AccountSettings } from '../pages/account-settings/account-settings';

@NgModule({
  declarations: [
    Lum,
    HomePage,
    CreateProfile,
    AccountSettings
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Lum),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Lum,
    HomePage,
    CreateProfile,
    AccountSettings
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
