import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { CreateProfile } from '../create-profile/create-profile'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/timeout';
declare let WifiWizard: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public activo: string;
  public perfilesLista: string[];
  public connected: boolean;
  //public checkConnection : any;


  constructor( private navCtrl: NavController, private http: Http, private nativeStorage: NativeStorage, private alertCtrl: AlertController ) {
    this.loadProfilesList();
    this.connected = false;
    //this.checkConnection = window.setInterval( function(){ this.checkWifi(this) } , 3000 );
    let obj = this;
    Observable.interval(3000).subscribe( x =>
    {
      (function(){

        let wifiError = function(){
          obj.connected = false;
          alert("Error al verificar la conexion");
        };


        let isConnected = function( res ){
          let isWifi = function(res){
            obj.connected = res == "\"Lum\"";
          };
          let wifiError = function(){
            obj.connected = false;
            alert("Error al verificar la conexion");
          };
          if( res ) WifiWizard.getCurrentSSID(isWifi, wifiError);
        };
        WifiWizard.isWifiEnabled( isConnected, wifiError);
      })();
    });

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

  test() : void{
    WifiWizard.getCurrentSSID( function(){alert("test")}, function(){alert("test")});

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
        this.http.post( 'http://192.168.4.1/index.lua', body, { headers: headers } )
        .timeout(3000)
        .subscribe(
           data => {
            if( data['_body'] == "true" || data['_body'] == "True"  ){
              obj.nativeStorage.setItem('Activo', { nombre: nombre })
              .then(
                () => {
                  obj.activo = nombre;
                },
                error => {
                  alert("Error en activacion del perfil");
                }
              );
            }else alert("Error en activacion del perfil");
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
