import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import * as moment from "moment";
import { AuthService } from '../../shared/services/auth.service';


import { FormControl } from '@angular/forms';


import { LoadingController, ToastController } from '@ionic/angular';
import { Goal } from 'src/app/shared/models/goal.model';

import { TaskManagementService } from 'src/app/shared/services/task-management.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { AuthRedoneService } from 'src/app/shared/services/authredone.service';
import { SubSink } from 'subsink';





@Component({
  selector: 'queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
})
export class QueueContainerComponent implements OnInit {

  private subs = new SubSink();
  
  taskSub: Subscription;
  goalsSub: Subscription;
  daySub: Subscription;

  tasks: Task[] = [];
  tasksSaved: Task[] = [];
  goals: Goal[] = [];
  ideas: any [] = [];

  tasksDay1: Task[] = [];
  tasksDay2: Task[] = [];
  tasksDay3: Task[] = [];
  tasksDay4: Task[] = [];
  tasksDay5: Task[] = [];

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

    this.subs.add(this.tmService.tasksDay1$.subscribe(t1 => {
      this.tasksDay1 = t1;
      console.dir(this.tasksDay1);
    }));
    this.subs.add(this.tmService.tasksDay2$.subscribe(t2 => this.tasksDay2 = t2));
    this.subs.add(this.tmService.tasksDay3$.subscribe(t3 => this.tasksDay3 = t3));
    this.subs.add(this.tmService.tasksDay4$.subscribe(t4 => this.tasksDay4 = t4));
    this.subs.add(this.tmService.tasksDay5$.subscribe(t5 => this.tasksDay5 = t5));
    this.subs.add(this.tmService.tasks$.subscribe(t => {
      this.tasks = t;
      this.tasksSaved = t;
    })); 
    this.subs.add(this.tmService.goals$.subscribe(g => this.goals = g));
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




  filterTags() {
     this.tasks = [...this.tasksSaved];
     if(this.tagOptions.value === 'All') {
       this.tmService.sortDays(5, [...this.tasks]);
       return;
     }
     this.tmService.sortDays(5, this.tasks.filter(task => task.tag === this.tagOptions.value));
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
     this.tmService.markTaskComplete(event, [...this.tasks]);
     this.getRandomQuote();
   }

  updateAllTasks(event) {
    this.tmService.updateAllTasks(event || [...this.tasks]);
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

  checkIfMilestoneDone(taskGoalId: string) : number {
    let currentTask;
    let complete = 1;
    const milestoneInQuestion = this.goals.find(goal => goal.id === taskGoalId);
    console.dir(milestoneInQuestion);
    milestoneInQuestion.taskChildren.forEach( currentTaskId => {
      currentTask = this.tasks.find(task => task.id === currentTaskId);
      if(currentTask && !currentTask.completed) {
        console.log("Milestone Not completed yet");
        console.dir(milestoneInQuestion);
        complete = 0;
      } 
    })

    return complete;
  
  }

  checkIfGoalDone(milestoneGoalId: string) : number {
    let milestone;
    let complete = 1;
    const goalInQuestion = this.goals.find(goal => goal.id === milestoneGoalId);
    console.dir(goalInQuestion);
    goalInQuestion.taskChildren.forEach( milestoneId => {
      milestone = this.tasks.find(task => task.id === milestoneId);
      if(milestone && !milestone.completed) {
        console.log("Goal Not completed yet");
        console.dir(goalInQuestion);
        complete = 0;
      } 
    })

    return complete;
  
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
    if(this.subs) this.subs.unsubscribe();
    if(this.daySub) this.daySub.unsubscribe();
  }

}