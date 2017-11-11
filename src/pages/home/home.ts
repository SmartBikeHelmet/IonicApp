import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { CreateProfile } from '../create-profile/create-profile'

import 'rxjs/add/operator/timeout';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public perfilesLista: string[];
  public activo: string;

  constructor( private navCtrl: NavController, private http: Http, private nativeStorage: NativeStorage, private alertCtrl: AlertController ) {
    this.loadProfilesList();
  }

  loadProfilesList () : void {
    let obj = this;
    this.nativeStorage.getItem( 'Activo' )
    .then(
      data  => obj.activo = data.nombre,
      error => obj.activo = null
    );
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




  sendDataToModule ( nombre ) : void {
    let obj = this;
    this.nativeStorage.getItem( nombre )
    .then(
      data => {

        var body = "intensidadDireccional="+ Math.floor( (data.direccionales/5.1)+1) +"&intensidadFrenado="+ Math.floor( (data.frenado/5.1)+1)  +"&frenadoContinuo="+ data.continuo;
        alert( body );
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post( 'http://192.168.111.1/index.lua', body, { headers: headers } )
        .timeout(3000)
        .subscribe(
           data => {
            console.log(data['_body']);
            // manage boolean received from server to let set as active
            obj.nativeStorage.setItem('Activo', { nombre: nombre })
            .then(
              () => {
                obj.activo = nombre;
              },
              error => {
                alert("Error en activacion del perfil");
              }
            );



           },
           error => {
            console.log(error);
            alert("Error enviando la informacion");
           }
         );
      },
      error => {
        alert("Error obteniendo el perfil");
      }
    );
  }

  confirmDelete( nombre ) : void {
    let obj = this;
    let thisAlertCrtl = this.alertCtrl;
    let storage = this.nativeStorage;
    this.nativeStorage.getItem( nombre )
    .then(
      // El arreglo de nombres existe
      data => {


        let alert = thisAlertCrtl.create({
          title: "El perfil "+nombre+" será eliminado permanentemente",
          message: "¿Está seguro de eliminar el perfil "+nombre+"?",
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Eliminacion cancelada');
              }
            },
            {
              text: 'Si',
              handler:
                () => {
                  storage.remove(nombre)
                    .then(
                      () => {
                        storage.getItem( 'PerfilNombres' )
                        .then(
                          data  =>{
                           data.nombres.splice( data.nombres.indexOf( nombre ) , 1);
                           storage.setItem( 'PerfilNombres', data )
                           .then(
                             () => {
                               obj.loadProfilesList();
                             },
                             error => {
                               console.log("Error al eliminar el perfil " + nombre);
                             }
                           );
                          },
                          error => obj.perfilesLista = []
                        );
                      },
                      error => {
                        console.log("Error al eliminar el perfil " + nombre);
                      }
                    );
                }
            }
          ]
        });
        alert.present();


      },
      // El arreglo de nombres NO existe
      error => {
        alert("Se presento un error: No se puede acceder al perfil "+nombre);
      }
    );
  }

}
