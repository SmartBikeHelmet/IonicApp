import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettings {

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage) {

  }
}
