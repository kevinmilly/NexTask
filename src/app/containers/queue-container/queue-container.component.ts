import { Component, OnInit, SimpleChanges } from '@angular/core';
import { BackendService } from '../../shared/services/backend.service';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import * as moment from "moment";
import { AuthService } from '../../shared/services/auth.service';

import {MatSnackBar} from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { TaskEntryComponent } from '../../presentational/ui/task-entry/task-entry.component';

import { ToastController } from '@ionic/angular';
import { Goal } from 'src/app/shared/models/goal.model';
import { ModalController } from '@ionic/angular';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { Quote } from '@angular/compiler';
import { BadgeService } from 'src/app/shared/services/badge.service';



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



  constructor(
      private tmService: TaskManagementService,
      public toastController: ToastController,
      private commentsService: CommentsService,
      private auth: AuthService,
      private badgesService:BadgeService
    ) { }


  ngOnInit(): void {  
    // this.commentsService.initComments();
    this.tmService.init();
    this.tasksDay1$ = this.tmService.tasksDay1$ 
    this.tasksDay2$ = this.tmService.tasksDay2$
    this.tasksDay3$ = this.tmService.tasksDay3$
    this.tasksDay4$ = this.tmService.tasksDay4$
    this.tasksDay5$ = this.tmService.tasksDay5$

    this.tmService.tasks$
      .subscribe(tasks => {
        this.tasks = tasks; 


        this.tmService.goals$.subscribe(g => {
          this.goals = g;

        })

      })
      
      this.quotes = this.commentsService.encouragement;

    
  }

createIdea(event) {
  this.tmService.createIdea(event);
}




  filterTags() {
     if(this.tagOptions.value === 'All') {
       this.tmService.sortDays(this.defaultHours, [...this.tasks]);
       return;
     }
     this.tmService.sortDays(this.defaultHours, this.tasks.filter(task => task.tag === this.tagOptions.value));
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
      message: message,
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
    const returnItem = this.tmService.editTask(event);

   }

   deleteTask(event) {
      this.tmService.deleteTask(event);
   }
 
   addInitialTask() {
     this.tmService.addInitialTask();
     this.getRandomQuote();
   }

   markTaskComplete(event) {
     this.tmService.markTaskComplete(event, this.tasks);
     this.getRandomQuote();
   }

  updateAllTasks(event) {
    this.tmService.updateAllTasks(event || [...this.tasks]);
  }


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

  logout() {this.auth.logout();}

  ngOnDestroy() {
    if(this.taskSub) this.taskSub.unsubscribe();
    if(this.daySub) this.daySub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.goalsSub) this.goalsSub.unsubscribe();
  }
}