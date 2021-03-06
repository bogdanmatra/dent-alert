import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string, passwordRepeat: string, type: string} = {
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    type: "doctor"
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  _passwordCheck() {
    if(this.account.password != this.account.passwordRepeat){
      this.translateService.get('PASSWORD_MATCH').subscribe((value) => {
        let toast = this.toastCtrl.create({
          message: value,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
      return false;
    }
    return true;
  }

  doSignup() {
    if (this._passwordCheck()) {

      // Attempt to login in through our User service
      this.user.signup(this.account)
        .then(() => {
          this.navCtrl.push(MainPage)})
        .catch((err) => {
          // Unable to sign up
          let toast = this.toastCtrl.create({
            message: this.signupErrorString + " " + err.message,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        });

    }
  }
}
