import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


import firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Subscription } from 'rxjs/internal/Subscription';
import { Task } from '../models/task.model';
import * as moment from 'moment';
import { Metrics } from '../models/metrics.model';

declare let gapi: any;

@Injectable({ providedIn: 'root' })
export class AuthService {

    // user$: Observable<User>;
    // user: User; 
    user$: Observable<firebase.User> = null;
    metrics: Metrics;
    user: any = null;
    loggedIn = false;
    authToken = '';
    afAuthSub: Subscription;
    // tasks: Task[];
    // tasksSub: Subscription;





    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
      
    ) { 
        // this.initClient();
        this.user$ = this.afAuth.authState;
        this.metrics = new Metrics(0,0,0,0,0,0);
        // this.user = { 
        //   displayName: "Kevin Smith",
        //   email: "kevinmilly@gmail.com",
        //   photoUrl: '',
        //   uid: 'QZbKvcTx0qePmkntahbrFFG7Xyh1' 
        //  };

      }


      googleLogin() {
        this.webGoogleLogin();
      }

      async webGoogleLogin(): Promise<void>{
        console.log("logging in");
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          const credential = await this.afAuth.signInWithPopup(provider);
          console.log({credential});
          console.log("Logging popup");

          this.afAuthSub = this.afAuth.authState.subscribe(user => {
                  console.log({user});
                  if (user){
                        localStorage.setItem('user', JSON.stringify(user));
                        
                        this.user = { 
                          displayName: user.displayName,
                          email: user.email,
                          photoUrl: user.photoURL,
                          uid: user.uid && user.uid 
                         };
                        console.dir(this.user);
                        if(!this.afs.collection(`users/`).doc(user.uid)) {
                          this.afs.collection(`users/`)
                          .add(this.user)
                          .then((docRef) => {
                             const addedUser = docRef.set(this.user, { merge: true });
                             
                             this.afs
                              .collection<Metrics>(`users/${this.user.uid}/metrics`)
                              .add(this.metrics)
                              .then((docRef) => {
                                const addedmetric = docRef.set(this.metrics, { merge: true });
                                docRef.update({
                                  id: docRef.id,
                                  ...this.metrics
                                })
                              })
                          })
                        } else {
                            this.afs.collection<Metrics>(`users/${this.user.uid}/metrics`)
                            .valueChanges().subscribe(metric => this.metrics = metric[0]);
                     
                        }
                      } else {
                        localStorage.setItem('user', null);
                        this.router.navigate(['/login']);
                      }
                      this.router.navigate(['']);
                 
              })
        } catch (error) {
            console.log({error});
        }
      }

      // initClient() {
      //   gapi.load('client', () => {
      //     console.log('loaded client');

      //     gapi.client.init({
      //       apiKey: 'AIzaSyAHq7tes1IxsaabtwD375WcQO3HJHGJR1I',
      //       clientId: '665563290905-kkd8mqv10q989rq1coq5ih04hbr5k9tv.apps.googleusercontent.com',
      //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      //       scope: 'https://www.googleapis.com/auth/calendar'

      //     })

      //     gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));
        
      //   })

      


      // }

    //   async login() {
    //     const googleAuth = gapi.auth2.getAuthInstance();

    //     console.log({googleAuth});
    //     const googleUser = await googleAuth.signIn();
    //     console.log({googleUser});

    //     const token = googleUser.getAuthResponse().id_token;

      
        
    //     const credential = firebase.auth.GoogleAuthProvider.credential(token);

    //     await this.afAuth.signInAndRetrieveDataWithCredential(credential);
    //     this.afAuth.authState.subscribe(user => {
    //       if (user){
    //             localStorage.setItem('user', JSON.stringify(this.user));
    //             this.router.navigate(['']);
    //             this.user = { 
    //               displayName: user.displayName,
    //               email: user.email,
    //               photoUrl: user.photoURL,
    //               uid: user.uid && user.uid 
    //              };
    //             console.dir(this.user);
    //           } else {
    //             localStorage.setItem('user', null);
    //             this.router.navigate(['/login']);
    //           }
    //           if(!this.afs.collection(`users/`).doc(user.uid)) {
    //             this.afs.collection(`users/`)
    //             .add(this.user)
    //             .then((docRef) => {
    //                const addedUser = docRef.set(this.user, { merge: true });
                   
    //                this.afs
    //                 .collection<Metrics>(`users/${this.user.uid}/metrics`)
    //                 .add(this.metrics)
    //                 .then((docRef) => {
    //                   const addedmetric = docRef.set(this.metrics, { merge: true });
    //                   docRef.update({
    //                     id: docRef.id,
    //                     ...this.metrics
    //                   })
    //                 })
    //             })
    //           } else {
    //               this.afs.collection<Metrics>(`users/${this.user.uid}/metrics`)
    //               .valueChanges().subscribe(metric => this.metrics = metric[0]);
           
    //           }
    //   })
    // }


    
    logout(){
      this.afAuth.signOut()
        .then( result => {
          localStorage.removeItem('user');
          this.user = null;
          this.router.navigate(['login']);
        })
    
    } 

    // //loop through the tasks, start with Date.now(), for each successive iteration use the end date of the previous
    // async insertEvents(tasks:Task[]) {
    //   console.dir(tasks);
    //   let start, end; 
    //   for(let i = 0; i<tasks.length; i++) {
    //     start = i === 0 ? new Date().toISOString() : moment(end).add(5,'minutes');
    //     end = minutesFromNow(start, tasks[i].minutes);

    //     console.log(`Start is ${moment(start).format('LLLL')} and end is ${moment(end).format('LLLL')}`);

    //     const insert = await gapi.client.calendar.events.insert({
    //       calendarId: 'primary',
    //       start: {
    //         dateTime: start,
    //         timeZone: 'America/New_York'
    //       },
    //       end: {
    //         dateTime: end,
    //         timeZone: 'America/New_York'
    //       },
    //       summary: tasks[i].title,
    //       description: tasks[i].description,
    //       colorId: this.getColorId(
    //                       tasks[i].priority,
    //                       tasks[i].difficulty,
    //                       tasks[i].urgency)
    //     })
    //   }

    // }

    getColorId(priority, difficulty, urgency) {
      if((priority + difficulty + urgency) < 4 || (priority + difficulty + urgency) === 4) { 
        return '8' 
      } else if((priority + difficulty + urgency) < 6 || (priority + difficulty + urgency) === 6) { 
          return '5';
      } else if((priority + difficulty + urgency) < 9 || (priority + difficulty + urgency) === 9) { 
          return '6';
      } else if((priority + difficulty + urgency) < 12 || (priority + difficulty + urgency) === 12) { 
          return '11';
      } else {
          return '11';
      }
      
    }
  

   


      
      // get isLoggedIn(): boolean {
      //   const  user  =  JSON.parse(localStorage.getItem('user'));
      //   // console.log({user});
      //   return  !!user;
      // }
      
      get isLoggedIn(): boolean {
       
        return this.user !== null;
      }
      
      get loggedInUser(): User {
        return this.user;
      }

   
      ngOnDestroy() {
        if(this.afAuthSub) {
          this.afAuthSub.unsubscribe();
        }
 
      }
}

const minutesFromNow = (start, n) => moment(start).add(n, 'minutes').toISOString();