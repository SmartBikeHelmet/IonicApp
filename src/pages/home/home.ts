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

  perfilesLista: string[];

  constructor( private navCtrl: NavController, private navParams: NavParams, private http: Http, private nativeStorage: NativeStorage ) {
    // this.imprimirKeys();

    var guardarLista = function( data ){
      this.perfilesLista = data;
      alert( this.perfilesLista );
    };

    this.nativeStorage.getItem( 'PerfilNombres' )
    .then(
      data => {
        guardarLista( data );
      },
      error => {
         return "error";
      }
    );
  }

  imprimirKeys(){
    this.nativeStorage.keys()
    .then(
      data => alert(data),
      error => alert(error)
    );
  }

  newProfileTapped($event){
    this.navCtrl.push( CreateProfile );
  }

  sendDataToModule(){
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
