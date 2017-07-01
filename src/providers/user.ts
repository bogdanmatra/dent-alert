import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

import * as firebase from 'firebase/app';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this._user = user
    });

    // Facebook redirect handler, save additional info from Facebook after redirect;
    var self = this;
    afAuth.auth.getRedirectResult().then(function(result) {
      if (result.user) {
        // Facebook users are automatically marked as 'patient'.
        // TODO Dentists will require special licence to sign up (after paying the subscription/ trial code).
        // TODO Skip save name when user already has a name.
        self._saveUserAdditionalInformation(result.user.uid, { name: result.user.displayName, type: 'patient'});
      }
    });
  }

  /**
   * Send Firebase login request
   */
  login(accountInfo: any) {
    return this.afAuth.auth.signInWithEmailAndPassword(accountInfo.email, accountInfo.password);
  }

  /**
   * Sign up with facebook
   */
  signUpWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider).then((result)=>{
      console.log(result);
    });
  }

  /**
   * Send Firebase sign up request
   */
  signup(accountInfo: any) {

    return this.afAuth.auth.createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((response)=>{
        var uuid: string = response.uid;
        this._saveUserAdditionalInformation(uuid, accountInfo);
        // TODO resolve when new promise is resolved
      })
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.afAuth.auth.signOut();
  }

  /**
   * User logged in.
   */
  isLoggedIn() : boolean  {
    return (this._user !== null) ;
  }

  /**
   * User state changed.
   */
  getUserChanged() : Observable<firebase.User>  {
    return this.afAuth.authState;
  }

  /**
   * Get current user details.
   */
  getUserDetails(uuid: string)  {
    return this.db.object('/users/' + uuid + "/");
  }

  _saveUserAdditionalInformation(uuid: string, accountInfo) {
    var newUser: FirebaseObjectObservable<any> = this.db.object('/users/' + uuid + "/");
    var newUserData =  { name: accountInfo.name, role: accountInfo.type };
    newUser.set(newUserData);
  }

}
