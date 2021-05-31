import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';


import firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Subscription } from 'rxjs/internal/Subscription';
import { Task } from '../../../shared/models/task.model';
import * as moment from 'moment';
import { Metrics } from '../../../shared/models/metrics.model';
import { Settings } from 'src/app/shared/models/settings.model';

declare let gapi: any;



@Injectable({ providedIn: 'root' })
export class AuthService {

  // user$: Observable<User>;
  // user: User; 
  user$: Observable<firebase.User> = null;
  metrics: Metrics;

  settings:Settings;
  user: any = null;
  loggedIn = false;
  authToken = '';
  afAuthSub: Subscription;






  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,

  ) {

    this.user$ = this.afAuth.authState;
    this.metrics = new Metrics(0, 0, 0, 0, 0, 0);


  }


  googleLogin() {
    this.webGoogleLogin();
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);


      this.afAuthSub = this.afAuth.authState.subscribe(user => {

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));

          this.user = {
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            uid: user.uid && user.uid
          };

          if(credential.additionalUserInfo.isNewUser) {
            //make their first metrics
            this.afs
            .collection<Metrics>(`users/${this.user.uid}/metrics`)
            .add(this.metrics)
            .then((docRef) => {
              const addedmetric = docRef.set(this.metrics, { merge: true });
              console.dir(addedmetric);
              docRef.update({
                id: docRef.id,
                ...this.metrics
              })
            })
        }


        this.afs.collection<Metrics>(`users/${this.user.uid}/metrics`)
          .valueChanges().subscribe(metric => this.metrics = metric[0]);

    
        } else {
          localStorage.setItem('user', null);
          this.router.navigate(['/login']);
        }
        // this.router.navigate(['']);
        this.router.navigate(['/tabs/tab1']);


      })
    } catch (error) {
      console.log({ error });
    }
  }




  logout() {
    this.afAuth.signOut()
      .then(result => {
        localStorage.removeItem('user');
        this.user = null;
        this.router.navigate(['login']);
      })

  }



  getColorId(priority, difficulty, urgency) {
    if ((priority + difficulty + urgency) < 4 || (priority + difficulty + urgency) === 4) {
      return '8'
    } else if ((priority + difficulty + urgency) < 6 || (priority + difficulty + urgency) === 6) {
      return '5';
    } else if ((priority + difficulty + urgency) < 9 || (priority + difficulty + urgency) === 9) {
      return '4';
    } else if ((priority + difficulty + urgency) < 12 || (priority + difficulty + urgency) === 12) {
      return '11';
    } else {
      return '11';
    }

  }



  get isLoggedIn(): boolean {

    return this.user !== null;
  }

  getloggedInUser(): any {
    return this.user;
  }

  get authMetrics() {
    return this.metrics;
  }


  ngOnDestroy() {
    if (this.afAuthSub) {
      this.afAuthSub.unsubscribe();
    }

  }
}

const minutesFromNow = (start, n) => moment(start).add(n, 'minutes').toISOString();