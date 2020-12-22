import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Idea } from '../models/idea.model';
import { Metrics } from '../models/metrics.model';
import { Badge } from '../models/badge.model';
import { testBadges } from '../test-data/test-badge';
import { Goal } from '../models/goal.model';


@Injectable({
  providedIn: 'root'
})
export class BackendService  {

  user: User; 
  metrics: Metrics = new Metrics(0, 0, 0, 0, 0, 0);
  badges:Badge[] = testBadges;

  private dayHours = new BehaviorSubject<any>(5);

  constructor( 
    private firestore: AngularFirestore, 
    private auth: AuthService,

   ) { }

  getAwards() {
    return this.auth.metrics;
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
      taskToUpdate.doc(task.id).update(task);


      
    });
      
  }

  updateGoals(goals: Goal[]) {
    const goalPromises = [];
    console.dir(goals);

    goals.forEach(goal => {
      goalPromises.push(this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`).doc(goal.id).update(goal));
    });
    Promise.all(goalPromises)
            .then(docRef => console.log({docRef}));
  }

  addTask(task) {
    const taskAdded = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`)
            .doc(task.id)
            .set(task, {merge: true});
      // .add(task)
      // .then((docRef) => {
      //   const data = { 
      //     db_id: docRef.id, 
      //     ...task
      //   } 
        
      //   return docRef.set(data, { merge: true });
       
      // })
      //add origination date here?
    
  }

  addTasks(tasks) {

    const taskPromises = [];
    tasks.forEach(task => {
        taskPromises.push(this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`).doc(task.id).set({...task}, {merge: true}));
      // taskPromises.push(this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`).add({...task}));
    });
    Promise.all(taskPromises)
      .then((docRef) => {
          // console.dir(docRef);
      }) 

  }
 
  addGoals(goals) {

    const goalPromises = [];
    goals.forEach(goal => {
      goalPromises.push(this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`).doc(goal.id).set({...goal}, {merge: true}));
      // goalPromises.push(this.firestore.collection<Goal>(`users/${this.user.uid}/Goals`).add({...goal}));
    });
    Promise.all(goalPromises)
      .then((docRef) => {
          console.dir(docRef);
      })
      
    

  }

  addMetric(task, typeOfUpdate) {
    this.metrics = this.auth.metrics;
    console.log({task});
  

            let metric;
            let awards: Badge[] = [];

            //update metrics
            console.log(typeOfUpdate);
            switch (typeOfUpdate) {
              case 'creation':
                metric = {
                  tasksCreated: this.metrics.tasksCreated++,
                  ...this.metrics
                }
            
                break;
              case 'completion':
                metric = {
                  toughTasks: task.difficulty > 3 ? this.metrics.toughTasks + 1 : this.metrics.toughTasks,
                  tasksCreated: this.metrics.tasksCreated,
                  completions: this.metrics.completions + 1,
                  importantTasks: task.priority > 3 ? this.metrics.importantTasks + 1 : this.metrics.importantTasks,
                  urgencyTasks:task.urgency > 3 ? this.metrics.urgencyTasks + 1 : this.metrics.urgencyTasks,
                  usageTime: this.metrics.usageTime,
                  id: this.metrics.id
                }
                console.log({metric});
      
                break;
            
            } 
            
            let toughBadges = [];
            let completionBadges = [];
            let timeBadges = [];
            let creationBadges = [];
            let importantBadges = [];
            let urgencyBadges = [];

            //figure out what badges we even need to consider

            if(metric.toughTasks > 0) toughBadges = this.badges.filter(b => b.type === 3)
                                          .sort((a,b) => a.criteria - b.criteria);
            if(metric.completions > 0) completionBadges = this.badges.filter(b => b.type === 1)
                                          .sort((a,b) => a.criteria - b.criteria);
            if(metric.usageTime > 0) timeBadges = this.badges.filter(b => b.type === 2)
                                          .sort((a,b) => a.criteria - b.criteria);
            if(metric.tasksCreated > 0) creationBadges = this.badges.filter(b => b.type === 4)
                                          .sort((a,b) => a.criteria - b.criteria);
            if(metric.importantTasks > 0) importantBadges = this.badges.filter(b => b.type === 5)
                                          .sort((a,b) => a.criteria - b.criteria);
            if(metric.urgencyTasks > 0) urgencyBadges = this.badges.filter(b => b.type === 6)
                                          .sort((a,b) => a.criteria - b.criteria);


            //collect awards based on metrics
            toughBadges.forEach(b => {
               if(metric.toughTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
                awards.push(b);
               }
            });
            completionBadges.forEach(b => {
               if(metric.completions >= b.criteria && !this.metrics.awards.includes(b.title)) {
                  awards.push(b);
               } 
            });
            timeBadges.forEach(b => {
               if(metric.usageTime >= b.criteria && !this.metrics.awards.includes(b.title)) {
                  awards.push(b);
               } 
            });
            creationBadges.forEach(b => {
               if(metric.tasksCreated >= b.criteria && !this.metrics.awards.includes(b.title)) {
                  awards.push(b);
               } 
            });
            importantBadges.forEach(b => {
               if(metric.importantTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
                  awards.push(b);
               } 
            });
            urgencyBadges.forEach(b => {
               if(metric.urgencyTasks >= b.criteria && !this.metrics.awards.includes(b.title)) {
                  awards.push(b);
               } 
            });

 
            if(this.metrics.awards.length > 0) {  
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

  updateMetric(metric) {
    const metricCollection = this.firestore.collection<Metrics>(`users/${this.user.uid}/metrics/`);
    metricCollection.doc(this.metrics.id).update(metric);
  }

  delete(task) {
      const collection = this.firestore.collection<Task>(`users/${this.user.uid}/Tasks`);
      collection.doc(task.id).delete();
  }

  deleteIdea(idea) {
    console.log({idea});
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

getAwardType(type:number) {
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

get yourMetrics () {
  return this.auth.metrics;
}

set yourMetrics(metrics) {
  this.metrics = metrics;
}





}
