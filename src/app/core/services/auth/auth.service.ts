import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
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

declare var gapi: any;
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";

import { Metrics } from "../../../shared/models/metrics.model";
import { Task } from "../../../shared/models/task.model";



@Injectable({ providedIn: 'root' })
export class AuthService {
    metrics: Metrics;
    user$: Observable<any>;
    private loggedUser: any;
    userProfile: any;
    private userLogged: any;


    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,

    ) {
        this.initClient();
        this.user$ = afAuth.authState;
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    console.log({user});
                    return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        )
        this.metrics = new Metrics(0, 0, 0, 0, 0, 0);
    }

    initClient() {
        gapi.load('client', () => {

            gapi.client.init({
                apiKey: 'AIzaSyAHq7tes1IxsaabtwD375WcQO3HJHGJR1I',
                clientId: '665563290905-kkd8mqv10q989rq1coq5ih04hbr5k9tv.apps.googleusercontent.com',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                scope: 'https://www.googleapis.com/auth/calendar'
            })
            gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));
        })
    }

    async login() {
        const googleAuth = gapi.auth2.getAuthInstance();
        const googleUser = await googleAuth.signIn();

        const token = googleUser.getAuthResponse().id_token;



        const credential = firebase.auth.GoogleAuthProvider.credential(token);

        const { user } = await this.afAuth.signInWithCredential(credential);
        this.updateUserData(user);

        this.router.navigate(['/tabs']);
    }



    async signOut() {
        await this.afAuth.signOut();

        this.router.navigate(['/login']);

    }


    private updateUserData(user) {

        this.loggedUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.loggedUser.uid}`);
        const metricRef: AngularFirestoreCollection<any> = this.afs.doc(`users/${this.loggedUser.uid}`).collection("metrics");

        //decide whether to make metrics for the first time
        metricRef.valueChanges().subscribe(m => {
            if (m.length > 0) {
                this.metrics = m[0];

            } else {

                metricRef.add({ ...this.metrics });
            }
        })

 

        userRef.set(this.loggedUser, { merge: true });

    }

    // //loop through the tasks, start with Date.now(), for each successive iteration use the end date of the previous
    async insertEvents(tasks: Task[], datetime, buffer) {

        let start, end;
        for (let i = 0; i < tasks.length; i++) {
            start = i === 0 ? datetime : moment(end).add(buffer, 'minutes');
            end = minutesFromNow(start, tasks[i].minutes);



            const insert = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                start: {
                    dateTime: start,
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: end,
                    timeZone: 'America/New_York'
                },
                summary: tasks[i].title,
                description: tasks[i].description,
                colorId: this.getColorId(
                    tasks[i].priority,
                    tasks[i].difficulty,
                    tasks[i].urgency,
                    tasks[i].pastDue
                )
            })
        }

    }

    getColorId(priority, difficulty, urgency, pastDue) {
        if ((priority + difficulty + urgency + pastDue) < 6 || (priority + difficulty + urgency + pastDue) === 4) {
            return '8'
        } else if ((priority + difficulty + urgency + pastDue) < 10 || (priority + difficulty + urgency + pastDue) === 6) {
            return '5';
        } else if ((priority + difficulty + urgency + pastDue) < 14 || (priority + difficulty + urgency + pastDue) === 9) {
            return '4';
        } else if ((priority + difficulty + urgency + pastDue) < 18 || (priority + difficulty + urgency + pastDue) === 12) {
            return '11';
        } else {
            return '11';
        }

    }


    get authMetrics() {
        return this.metrics;
    }

    get user(): any {
        return this.loggedUser;
    }

}

const minutesFromNow = (start, n) => moment(start).add(n, 'minutes').toISOString();