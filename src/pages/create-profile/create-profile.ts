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
  keys: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage) {
    this.nombrePerfil = "";
    this.intensidadDireccionales = 10;
    this.intensidadFrenado = 10;
    this.frenadoContinua = false;
    this.intensidadFrenadoContinua = 10;
    this.nativeStorage.clear();
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

    var storage = this.nativeStorage;
    var navigation = this.navCtrl;

    this.nativeStorage.getItem( 'PerfilNombres' )
    .then(
      // El arreglo de nombres existe
      data => {
        // Se empuja el ultimo nombre
        storage.setItem( 'PerfilNombres', data.nombres.push( perfil.nombrePerfil ) )
        .then(

          // Se guarda el arreglo de nombres
          () => {
            // Se guarda el perfil con el nombre como llave
            storage.setItem( perfil.nombrePerfil, perfil )
            .then(

              // Se guarda el perfil bien, se retorna en la navegacion
              () => {
                navigation.pop();
              },
              // Error
              error => {
                alert('Se presento un error en el guardado, intenta mas tarde');
              }
            );
          },
          // Error
          error => {
            alert('Se presento un error en el guardado, intenta mas tarde');
          }
        );
      },

      // El arreglo de nombres no existe
      error => {
        // Se crea el arreglo con el ultimo nombre
        storage.setItem( 'PerfilNombres', { nombres: [ perfil.nombrePerfil ] } )
        .then(

          // Se guarda el arreglo de nombres
          () => {
            // Se guarda el perfil con el nombre como llave
            storage.setItem( perfil.nombrePerfil, perfil )
            .then(
              // Se guarda el perfil bien, se retorna en la navegacion
              () => {
                navigation.pop();
              },
              // Error
              error => {
                alert('Se presento un error en el guardado, intenta mas tarde');
              }
            );
          },
          // Error
          error => {
            alert('Se presento un error en el guardado, intenta mas tarde');
          }
        );
      }
    );
  }



}
