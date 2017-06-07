import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

import * as firebase from 'firebase/app';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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
  }

  /**
   * Send Firebase auth request
   */
  login(accountInfo: any) {
    return this.afAuth.auth.signInWithEmailAndPassword(accountInfo.email, accountInfo.password);
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    var db = this.db;
    return this.afAuth.auth.createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((response)=>{
        var uuid: string = response.uid;
        var newUser: FirebaseObjectObservable<any> = db.object('/users/' + uuid + "/");
        var newUserData =  { name: accountInfo.name };
        newUser.set(newUserData);
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
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
