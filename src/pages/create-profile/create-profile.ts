import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

export interface Perfil {
  nombre:         string;
  direccionales:  number;
  frenado:          number;
  continuo:       boolean;
}

@Component({
  selector: 'create-profile',
  templateUrl: 'create-profile.html'
})
export class CreateProfile {
  perfil: Perfil;

  constructor( private navCtrl: NavController, private navParams: NavParams, private nativeStorage: NativeStorage ) {
    this.perfil = { nombre: "", direccionales: 10, frenado: 10, continuo: false };
    this.reload = this.navParams.get("callback");
  }

  createProfile (){
    let thisObj = this;
    let storage = this.nativeStorage;
    let navigation = this.navCtrl;
    let adicional = this.perfil;

    this.nativeStorage.getItem( 'PerfilNombres' )
    .then(
      // El arreglo de nombres existe
      data => {
        // Se empuja el ultimo nombre
        data.nombres.push( adicional.nombre );

        storage.setItem( 'PerfilNombres', data )
        .then(

          // Se guarda el arreglo de nombres
          () => {
            // Se guarda el perfil con el nombre como llave
            storage.setItem( adicional.nombre, adicional )
            .then(

              // Se guarda el perfil bien, se retorna en la navegacion
              () => {
                thisObj.reload().then(() => {
                    navigation.pop();
                });
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
        storage.setItem( 'PerfilNombres', { nombres: [ adicional.nombre ] } )
        .then(

          // Se guarda el arreglo de nombres
          () => {
            // Se guarda el perfil con el nombre como llave
            storage.setItem( adicional.nombre, adicional )
            .then(
              // Se guarda el perfil bien, se retorna en la navegacion
              () => {
                thisObj.reload().then(() => {
                  navigation.pop();
                });
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
