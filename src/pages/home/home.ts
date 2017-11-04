import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

import { CreateProfile } from '../create-profile/create-profile'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public perfilesLista: string[];

  constructor( private navCtrl: NavController, private navParams: NavParams, private http: Http, private nativeStorage: NativeStorage ) {
    this.loadProfilesList();
  }

  loadProfilesList () : void {
    let obj = this;
    this.nativeStorage.getItem( 'PerfilNombres' )
    .then(
      data  => obj.perfilesLista = data.nombres,
      error => obj.perfilesLista = []
    );
  }

  newProfileTapped ( $event ) : void {
    // callback...
    let obj = this;
    let callbackReload = function() {
      return new Promise((resolve, reject) => {
        obj.loadProfilesList();
        resolve();
      });
    }

    this.navCtrl.push( CreateProfile, {
        callback: callbackReload
    });
  }


  sendDataToModule () : void {
    //alert( nombre );

    var body = "intensidadDireccional=1&intensidadFrenado=2&frenadoContinuo=false";
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
