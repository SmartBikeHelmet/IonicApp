import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

export interface Passwords{
  actual: string;
  new: string;
  repeat: string;
}

@Component({
  selector: 'account-settings',
  templateUrl: 'account-settings.html'
})
export class AccountSettings {
  activo: boolean;
  pass: Passwords;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.activo = false;

    this.pass = { actual: null, new: null, repeat: null };
  }

  checkFormForBtn(){
    if( this.pass.actual != null && this.pass.new != null && this.pass.repeat == this.pass.new ){
      this.activo = true;
    } else {
      this.activo = false;
    }
  }

  sendDataToModule( event ){
    alert("Envía");
  }
}
