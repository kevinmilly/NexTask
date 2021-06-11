import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../../shared/models/user.model';
import { Task } from '../../../shared/models//task.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Idea } from '../../../shared/models//idea.model';
import { Metrics } from '../../../shared/models//metrics.model';
import { Badge } from '../../../shared/models//badge.model';
import { testBadges } from '../../../shared/test-data/test-badge';
import { Goal } from '../../../shared/models//goal.model';
import { AuthService } from '../auth/auth.service';
import { Settings } from 'src/app/shared/models/settings.model';
import { take } from 'rxjs/internal/operators/take';
import { BadgeService } from '../badge/badge.service';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  user: User;
  metrics: Metrics = new Metrics(0, 0, 0, 0, 0, 0);
  badges: Badge[] = testBadges;

  private dayHours = new BehaviorSubject<any>(8);

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    // private badgesService:BadgeService

  ) {
    this.user = this.auth.user;
  }

  getAwards() {
    return this.auth.authMetrics;
  }

  getDayHours(): Observable<any> {
    return this.dayHours.asObservable();
  }

  setDayHours(hours: number) {
    this.dayHours.next(hours);
  }

  getTasks() {
    return this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
  }
  getGoals() {

    return this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`);
  }

  getIdeas() {
    return this.firestore.collection<Idea>(`users/${this.user.uid}/Ideas`);
  }

  updateTask(task) {
    const taskCollection = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
    taskCollection.doc(task.id).update(task);
  }

  updateTasks(tasks) {
    let taskToUpdate;
    tasks.forEach(task => {
      taskToUpdate = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
      taskToUpdate.doc(task.id).update({ ...task });
    });

  }

  updateGoals(goals: Goal[]) {
    const goalPromises = [];


    goals.forEach(goal => {
      goalPromises.push(this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`).doc(goal.id).update({ ...goal }));
    });
    Promise.all(goalPromises)
      .then(docRef => console.log({ docRef }));
  }

  addTask(task) {
    const taskAdded = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`)
      .doc(task.id)
      .set(task, { merge: true });


  }

  addTasks(tasks) {

    const taskPromises = [];
    tasks.forEach(task => {
      taskPromises.push(this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`).doc(task.id).set({ ...task }, { merge: true }));

    });
    Promise.all(taskPromises)
      .then((docRef) => {

      })

  }

  addGoals(goals) {

    const goalPromises = [];
    goals.forEach(goal => {
      goalPromises.push(this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`).doc(goal.id).set({ ...goal }, { merge: true }));

    });
    Promise.all(goalPromises)
      .then((docRef) => {

      })



  }

  updateSettings(settings: Settings) {
    this.firestore.collection<Settings>(`users/${this.user.uid}/Settings`)
      .doc(settings.id).set({ ...settings }, { merge: true })

  }

  getSettings() {
    return this.firestore.collection<Settings>(`users/${this.user.uid}/Settings`);
  }

  addMetric(task, typeOfUpdate) {
    this.metrics = this.auth.authMetrics;
    let metric;
    
    switch (typeOfUpdate) {
      case 'creation':
        metric = {
          tasksCreated: this.metrics.tasksCreated++,
          id: this.metrics.id,
          ...this.metrics
        }

        break;
      case 'completion':
        metric = {
          toughTasks: task.difficulty > 3 ? this.metrics.toughTasks + 1 : this.metrics.toughTasks,
          tasksCreated: this.metrics.tasksCreated,
          completions: this.metrics.completions + 1,
          importantTasks: task.priority > 3 ? this.metrics.importantTasks + 1 : this.metrics.importantTasks,
          urgencyTasks: task.urgency > 3 ? this.metrics.urgencyTasks + 1 : this.metrics.urgencyTasks,
          usageTime: this.metrics.usageTime,
          id: this.metrics.id
        }


        break;

    }

    //TODO: Need to complete gamification function
    // const [returnedMetric, awards] = this.badgesService.determineAwards(metric);


    this.updateMetric(metric);

    // return awards;
    return [];

  }

  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  updateMetric(metric) {
    try {
      const metricCollection = this.firestore.collection<Metrics>(`users/${this.user.uid}/metrics/`);
      metricCollection.doc(this.metrics.id).update(metric);
    } catch (error) {
      console.dir(error);
    }
  }

  delete(task) {
    const collection = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
    collection.doc(task.id).delete();
  }

  deleteGoal(goal) {
    const collection = this.firestore.collection<Task>(`users/${this.user.uid}/Goals`);
    collection.doc(goal.id).delete();
  }



  getAwardType(type: number) {
    switch (type) {
      case 1:
        return `Task Completions.`;
      case 2:
        return `days rocking and rolling`;
      case 3:
        return `Importance`;
      case 4:
        return `Importance`;
      case 5:
        return `Importance`;
      case 6:
        return `Importance`;

    }
  }

  get yourMetrics() {
    return this.auth.authMetrics;
  }

  set yourMetrics(metrics) {
    this.metrics = metrics;
  }





}
