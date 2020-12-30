import { Injectable } from "@angular/core";
import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';


import { AngularFireAuth } from '@angular/fire/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';



import { 
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Metrics } from "../models/metrics.model";





@Injectable({ providedIn: 'root' })
export class AuthRedoneService {
    metrics: Metrics;
    user$:Observable<any>;
    private loggedUser:any;
   

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
        
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap( user => {
                if(user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
                } else {
                    localStorage.setItem('user', null);
                    return of(null);
                }
            })
        )
        this.metrics = new Metrics(0,0,0,0,0,0);
    }

    async googleSignin() {
      
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = await this.afAuth.signInWithPopup(provider);
        console.log({credential});

         this.updateUserData(credential.user);
         this.router.navigate(['/tabs']);

    }

    async signOut() {
        await this.afAuth.signOut();
        console.log('tried to logout');
        this.router.navigate(['/login']);

    }


    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const metricRef: AngularFirestoreCollection<any> = this.afs.doc(`users/${user.uid}`).collection("metrics");
    
        this.loggedUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };

        
        //    if(!metricRef) {
        //        metricRef.add({...this.metrics});
        //    } 
           metricRef
           .valueChanges().subscribe(metric => {
               if(metric) {
                this.metrics = metric[0]
               } else {
                metricRef.add({...this.metrics});
               }
              
            
            });
        
 

         userRef.set(this.loggedUser, {merge: true});
        
    }

    get authMetrics() {
        return this.metrics;
      }

      get user(): any {
        return this.loggedUser;
      }

}