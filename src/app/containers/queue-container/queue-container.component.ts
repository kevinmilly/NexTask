import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import * as moment from "moment";
import { AuthService } from '../../shared/services/auth.service';


import { FormControl } from '@angular/forms';


import { LoadingController, ToastController } from '@ionic/angular';


import { TaskManagementService } from 'src/app/shared/services/task-management.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { AuthRedoneService } from 'src/app/shared/services/authredone.service';

import { map } from 'rxjs/operators';
import { Goal } from 'src/app/shared/models/goal.model';
// import { SubSink } from 'subsink';

interface TaskAndGoal {
  goalAndTask: [Goal[],Task[]]
}



@Component({
  selector: 'queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
})
export class QueueContainerComponent implements OnInit {

  // private subs = new SubSink();
  
  taskSub: Subscription;
  goalsSub: Subscription;
  daySub: Subscription;

  // tasks: Task[] = [];
  // tasksSaved: Task[] = [];
  // goals: Goal[] = [];
  ideas: any [] = [];

  // tasksDay1: Task[] = [];
  // tasksDay2: Task[] = [];
  // tasksDay3: Task[] = [];
  // tasksDay4: Task[] = [];
  // tasksDay5: Task[] = [];


  tasksDay1$:Observable<Task[]>;
  tasksDay2$:Observable<Task[]>;
  tasksDay3$:Observable<Task[]>;
  tasksDay4$:Observable<Task[]>;
  tasksDay5$:Observable<Task[]>;

  defaultHours = 0; 

  tags = ['general', 'All'];
  tagOptions = new FormControl('general',[]);
  
  addSub: Subscription;
  quotes;
  userInfo;

 

  constructor(
      private tmService: TaskManagementService,
      public toastController: ToastController,
      private commentsService: CommentsService,
      private auth: AuthRedoneService,
      private loadingController: LoadingController
    ) { }


  ngOnInit(): void {  
    // this.commentsService.initComments();
    this.tmService.init();


    this.tasksDay1$ = this.tmService.tasks$.pipe(map((tasks:any) => tasks[0].filter(t => t.day === 1))),
    this.tasksDay2$ = this.tmService.tasks$.pipe(map((tasks:any) => tasks[0].filter(t => t.day === 2))),
    this.tasksDay3$ = this.tmService.tasks$.pipe(map((tasks:any) => tasks[0].filter(t => t.day === 3))),
    this.tasksDay4$ = this.tmService.tasks$.pipe(map((tasks:any) => tasks[0].filter(t => t.day === 4))),
    this.tasksDay5$ = this.tmService.tasks$.pipe(map((tasks:any) => tasks[0].filter(t => t.day === 5)))
  
  

    // this.subs.add(this.tmService.tasksDay1$.subscribe(t1 => {
    //   this.tasksDay1 = t1;
    //   console.dir(this.tasksDay1);
    // }));
    // this.subs.add(this.tmService.tasksDay2$.subscribe(t2 => this.tasksDay2 = t2));
    // this.subs.add(this.tmService.tasksDay3$.subscribe(t3 => this.tasksDay3 = t3));
    // this.subs.add(this.tmService.tasksDay4$.subscribe(t4 => this.tasksDay4 = t4));
    // this.subs.add(this.tmService.tasksDay5$.subscribe(t5 => this.tasksDay5 = t5));
    // this.subs.add(this.tmService.tasks$.subscribe(t => {
    //   this.tasks = t;
    //   this.tasksSaved = t;
    // })); 
    // this.subs.add(this.tmService.goals$.subscribe(g => this.goals = g));

    
    this.presentLoading(4,"Looking for goals and tasks");
    this.quotes = this.commentsService.encouragement;
    this.tags =  this.tmService.filterTags;
    this.userInfo = this.auth.user;
    
  }

createIdea(event) {
  this.tmService.createIdea(event);
}

createEvents(tasks) {
  this.tmService.createEvent(tasks);
}



  //TODO: make a reactive version of the in the server (subject-based?)
  filterTags() {
   
     if(this.tagOptions.value === 'All') {
      //  this.tmService.sortDays(5);
       return;
     }
    //  this.tmService.sortDays(5, this.tagOptions.value);
  }

  getRandomQuote() {
    this.presentToast(this.quotes[Math.floor(Math.random()*(this.quotes.length))]);
  }

  // pushToCalendar(day) {

  //   this.auth.insertEvents(this.tasks.filter(t => t.day === day));
  //   this.presentToast("Added to your Calendar!");
   
  // }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: `Hey ${this.userInfo.displayName}! ${message}`,
      duration: 2000
    });
    toast.present();
  }

  async presentTwoPartToast(main, sub) {
    const toast = await this.toastController.create({
      header: main,
      message: sub,
      duration: 2000
    });
    toast.present();
  }


  editTask(event) {
    const returnItem = this.tmService.editItem(event, 'task');

   }

   deleteTask(event) {
      this.tmService.deleteTask(event);
   }
 
   addInitialTask() {
     this.tmService.addInitialTask();
     this.getRandomQuote();
   }

   markTaskComplete(event) {
    // this.presentLoading(4,"Reloading");
     this.tmService.markTaskComplete(event);
     this.getRandomQuote();
   }

  updateAllTasks(event) {
    this.tmService.updateAllTasks(event);
  }

  addTask() {
    this.tmService.addTask();
    this.presentLoading(1,"Reloading");
  }

  addGoal() { 
    this.presentLoading(1,"Reloading");
    this.tmService.addGoal();
  }


  showAwards() {this.tmService.showAwards();}


  dateDifference(d1,d2) {
    const diff = moment(d1).diff(moment(d2), 'days'); 
    return diff || 0;
  }



  async presentLoading(d, m) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: m,
      duration: d
    });
    await loading.present();

    const { data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  logout() {this.auth.signOut();}

  ngOnDestroy() {
    // if(this.subs) this.subs.unsubscribe();
    // if(this.daySub) this.daySub.unsubscribe();
  }

}