import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'create-profile',
  templateUrl: 'create-profile.html'
})
export class CreateProfile {
  nombrePerfil: string;
  intensidadDireccionales: number;
  intensidadFrenado: number;
  frenadoContinua: boolean;
  intensidadFrenadoContinua: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage) {
    this.nombrePerfil = "";
    this.intensidadDireccionales = 10;
    this.intensidadFrenado = 10;
    this.frenadoContinua = false;
    this.intensidadFrenadoContinua = 10;
    //this.nativeStorage.clear();
  }

  createProfile(){
    let perfil: any = {};
    perfil.nombrePerfil = this.nombrePerfil;
    perfil.intensidadDireccionales = this.intensidadDireccionales;
    perfil.intensidadFrenado = this.intensidadFrenado;
    perfil.frenadoContinua = this.frenadoContinua;
    if( this.frenadoContinua )
      perfil.intensidadFrenadoContinua = this.intensidadFrenadoContinua;
    else
      perfil.intensidadFrenadoContinua = null;

    /*this.nativeStorage.getItem( 'PerfilNombres' )
    .then(
      data => {
        this.nativeStorage.setItem( 'PerfilNombres', data.push( perfil.nombrePerfil ) )
        .then(
          error => {
            console.error('Error storing item', error);
          }
        );
      },
      error => {
        this.nativeStorage.setItem( 'PerfilNombres', [].push( perfil.nombrePerfil ) )
        .then(
          error => {
            console.error('Error storing item', error);
          }
        );
      }
    );

    this.nativeStorage.setItem( perfil.nombrePerfil, perfil )
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );*/



    console.log(JSON.stringify(perfil));
  }

}
