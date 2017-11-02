import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { CreateProfile } from '../create-profile/create-profile'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http ) {

  }

  newProfileTapped($event){
    this.navCtrl.push( CreateProfile );
  }

  sendDataToModule(){
      var body = "intensidadDireccional=1&intensidadFrenado=2&frenadoContinuo=false";//{ intensidadDireccional: 1, intensidadFrenado: 1, frenadoContinuo: true };
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post( 'http://192.168.111.1/index.lua', body, { headers: headers } )
      .subscribe(
         data => {
          console.log(data['_body']);
        },
         error => {
          console.log(error);
         }
       );
  }
}
