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





@Component({
  selector: 'queue-container',
  templateUrl: './queue-container.component.html',
  styleUrls: ['./queue-container.component.scss'],
})
export class QueueContainerComponent implements OnInit {


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
    this.tasksDay1$ = this.tmService.tasksDay1$ 
    this.tasksDay2$ = this.tmService.tasksDay2$
    this.tasksDay3$ = this.tmService.tasksDay3$
    this.tasksDay4$ = this.tmService.tasksDay4$
    this.tasksDay5$ = this.tmService.tasksDay5$

    this.taskSub = this.tmService.tasks$
      .subscribe(tasks => {
        this.tasks = tasks; 
        this.tasksSaved = tasks;

        this.tmService.goals$.subscribe(g => {
          this.goals = g;

        })

      })
      this.presentLoading(4,"Looking for goals and tasks");
      this.quotes = this.commentsService.encouragement;
      this.tags =  this.tmService.filterTags;
      this.userInfo = this.auth.user;
    
  }

createIdea(event) {
  this.tmService.createIdea(event);
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
     this.tmService.markTaskComplete(event, [...this.tasks]);
     this.getRandomQuote();
     this.presentLoading(4,"Reloading");
   }

  updateAllTasks(event) {
    this.tmService.updateAllTasks(event || [...this.tasks]);
  }

  addTask() {
    this.tmService.addTask();
    this.presentLoading(1,"Reloading");
  }

  addGoal() { 
    this.tmService.addGoal();
    this.presentLoading(3,"Reloading");

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
    if(this.taskSub) this.taskSub.unsubscribe();
    if(this.daySub) this.daySub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.goalsSub) this.goalsSub.unsubscribe();
  }
}