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
import { AuthRedoneService } from '../auth/authredone.service';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  user: User;
  metrics: Metrics = new Metrics(0, 0, 0, 0, 0, 0);
  badges: Badge[] = testBadges;

  private dayHours = new BehaviorSubject<any>(5);

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthRedoneService,

  ) { }

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
    this.user = this.auth.user;
    return this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
  }
  getGoals() {
    this.user = this.auth.user;

    return this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`);
  }

  getIdeas() {
    this.user = this.auth.user;
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

  addMetric(task, typeOfUpdate) {
    this.metrics = this.auth.authMetrics;

    let metric;
    let awards: Badge[] = [];


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

    let toughBadges = [];
    let completionBadges = [];
    let timeBadges = [];
    let creationBadges = [];
    let importantBadges = [];
    let urgencyBadges = [];

    //figure out what badges we even need to consider

    if (metric.toughTasks > 0) toughBadges = this.badges.filter(b => b.type === 3)
      .sort((a, b) => a.criteria - b.criteria);
    if (metric.completions > 0) completionBadges = this.badges.filter(b => b.type === 1)
      .sort((a, b) => a.criteria - b.criteria);
    if (metric.usageTime > 0) timeBadges = this.badges.filter(b => b.type === 2)
      .sort((a, b) => a.criteria - b.criteria);
    if (metric.tasksCreated > 0) creationBadges = this.badges.filter(b => b.type === 4)
      .sort((a, b) => a.criteria - b.criteria);
    if (metric.importantTasks > 0) importantBadges = this.badges.filter(b => b.type === 5)
      .sort((a, b) => a.criteria - b.criteria);
    if (metric.urgencyTasks > 0) urgencyBadges = this.badges.filter(b => b.type === 6)
      .sort((a, b) => a.criteria - b.criteria);


    //collect awards based on metrics
    toughBadges.forEach(b => {
      if (metric.toughTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });
    completionBadges.forEach(b => {
      if (metric.completions >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });
    timeBadges.forEach(b => {
      if (metric.usageTime >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });
    creationBadges.forEach(b => {
      if (metric.tasksCreated >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });
    importantBadges.forEach(b => {
      if (metric.importantTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });
    urgencyBadges.forEach(b => {
      if (metric.urgencyTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
        awards.push(b);
      }
    });


    if (this.metrics.awards.length > 0) {
      metric.awards = [...this.metrics.awards, ...awards.map(a => a.title)];

    } else {
      metric.awards = [...awards.map(a => a.title)];
    }

    this.updateMetric(metric);

    // this.presentAwards(awards);
    return awards;

  }

  addIdea(idea) {
    console.dir(idea);
    const ideaAdded = this.firestore.collection<string>(`users/${this.user.uid}/Ideas`)
      .add(idea)
      .then((docRef) => {
        const data = {
          id: docRef.id,
          ...idea
        }

        return docRef.set(data, { merge: true })
      })

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

  deleteIdea(idea) {

    const collection = this.firestore.collection<Idea>(`users/${this.user.uid}/Ideas`);
    collection.doc(idea.id).delete();
  }

  // presentAwards(awards) {
  //   console.dir(awards);
  //   awards.forEach((a, index) => {
  //     this.snackbar.open(
  //       `You received ${a.title}!`, 
  //        `${a.criteria} ${this.getAwardType(a.type)}`, {
  //       duration:3000 * (index+1),
  //       verticalPosition: 'top'
  //     });
  //   });
  // }

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
