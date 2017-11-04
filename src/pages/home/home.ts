import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { CreateProfile } from '../create-profile/create-profile'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public perfilesLista: string[];
  public activo: string;

  constructor( private navCtrl: NavController, private navParams: NavParams, private http: Http, private nativeStorage: NativeStorage, private alertCtrl: AlertController ) {
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
    alert(nombre);
    this.nativeStorage.getItem( nombre )
    .then(
      data => {
        var body = "intensidadDireccional="+ data.direccionales +"&intensidadFrenado="+ data.frenado +"&frenadoContinuo="+ data.continuo;
        alert( body );
        obj.nativeStorage.setItem('Activo', { nombre: data.nombre })
        .then(
          () => {
            obj.activo = data.nombre;
          },
          error => {

          }
        );
        /*var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post( 'http://192.168.111.1/index.lua', body, { headers: headers } )
        .subscribe(
           data => {
            console.log(data['_body']);
          },
           error => {
            console.log(error);
           }
         );*/
      },
      error => {

      }
    );
  }

  deleteName ( nombre ) : void {
    let obj = this;

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
              handler: () => {
                storage.remove(nombre)
                .then(
                  () => {
                    storage.getItem( 'PerfilNombres' )
                    .then(
                      data  =>{
                       data.nombres.splice( data.nombres.indexOf( nombre ) );
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
