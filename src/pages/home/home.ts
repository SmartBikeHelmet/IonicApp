import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CreateProfile } from '../create-profile/create-profile'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  newProfileTapped($event){
    this.navCtrl.push( CreateProfile );
  }

}
