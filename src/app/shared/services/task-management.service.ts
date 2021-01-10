import { Injectable } from '@angular/core';

import * as moment from "moment";
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Task } from '../../shared/models/task.model';
import { Goal } from 'src/app/shared/models/goal.model';

import { BackendService } from './backend.service';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskEntryComponent } from 'src/app/presentational/ui/task-entry/task-entry.component';
import { ShowAwardComponent } from 'src/app/presentational/display/show-award/show-award.component';


import { GoalEntryComponent } from 'src/app/presentational/ui/goal-entry/goal-entry.component';
import { map, tap} from 'rxjs/operators';
import { AuthRedoneService } from './authredone.service';
import { ItemEditComponent } from 'src/app/presentational/ui/item-edit/item-edit.component';
import { MilestoneEntryComponent } from 'src/app/presentational/ui/milestone-entry/milestone-entry.component';
import { DateTimeEntryComponent } from 'src/app/presentational/ui/date-time-entry/date-time-entry.component';
import { merge, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {
 

  taskSub: Subscription;
  goalsSub: Subscription;
  daySub: Subscription;
  addSub: Subscription;
  showAwardSub: Subscription;
  settingsSub: Subscription;
  ideaSub: Subscription;

//  private tasks: Task[]= []; 
//  private allTasks: Task[] =[];
//  private goals: Goal[]= []; 
//  private tasksDay1: Task[] = [];
//  private tasksDay2: Task[] = [];
//  private tasksDay3: Task[] = [];
//  private tasksDay4: Task[] = [];
//  private tasksDay5: Task[] = [];

  // private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject([]);
  // private allTasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject([]);
  // private goalsSubject: BehaviorSubject<Goal[]> = new BehaviorSubject([]);
  // private tasksDay1Subject: BehaviorSubject<Task[]> =  new BehaviorSubject([]);
  // private tasksDay2Subject: BehaviorSubject<Task[]> =  new BehaviorSubject([]);
  // private tasksDay3Subject: BehaviorSubject<Task[]> =  new BehaviorSubject([]);
  // private tasksDay4Subject: BehaviorSubject<Task[]> =  new BehaviorSubject([]);
  // private tasksDay5Subject: BehaviorSubject<Task[]> =  new BehaviorSubject([]);

  // public allTasks$: Observable<Task[]> = this.allTasksSubject.asObservable();
  // public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  // public goals$: Observable<Goal[]> = this.goalsSubject.asObservable();
  // public tasksDay1$: Observable<Task []> = this.tasksDay1Subject.asObservable();
  // public tasksDay2$: Observable<Task []> = this.tasksDay2Subject.asObservable();
  // public tasksDay3$: Observable<Task []> = this.tasksDay3Subject.asObservable();
  // public tasksDay4$: Observable<Task []> = this.tasksDay4Subject.asObservable();
  // public tasksDay5$: Observable<Task []> = this.tasksDay5Subject.asObservable();

  public allTasks$: Observable<Task[]>;
  public tasks$: Observable<Task[]>;
  public goals$: Observable<Goal[]>;
  public tasksDay1$: Observable<Task []>;
  public tasksDay2$: Observable<Task []>;
  public tasksDay3$: Observable<Task []>;
  public tasksDay4$: Observable<Task []>;
  public tasksDay5$: Observable<Task []>;

  defaultHours = 5; 

  private tags = ['general', 'All'];
  tagOptions = new FormControl('general',[]);

  ideaForm;
  ideas;


  constructor(
    private backend: BackendService, 
    private auth: AuthRedoneService, 
    public modalController: ModalController,
    
  ) { 

    

    }

  public init(): void {  

    this.goals$ = this.backend.getGoals().valueChanges();
    this.allTasks$ = this.backend.getTasks().valueChanges();
      this.tasks$ = merge(
      this.backend.getTasks().valueChanges().pipe(
        map(tasks => tasks.filter(t => !t.completed)),
        map(tasks => this.incrementDaysForTasks(6,tasks)),
        map(tasks => this.calculatePastDue(tasks))
      ),
      combineLatest([this.tasks$,this.goals$])
        .pipe(map(([tasks,goals]) => this.sortTasksAndGoals(tasks,goals)))
    )
    .pipe(
      tap(t => {
          t.forEach(t => {
            if(t.tag && !this.tags.find(currentTag => currentTag === t.tag)) this.tags.push(t.tag)
          });
      }),
      tap(tasks => console.dir(tasks)),
      );

    
      this.tasksDay1$ = this.tasks$.pipe(map(tasks => tasks.filter(t => t.day === 1)));
      this. tasksDay2$ = this.tasks$.pipe(map(tasks => tasks.filter(t => t.day === 2)));
      this. tasksDay3$ = this.tasks$.pipe(map(tasks => tasks.filter(t => t.day === 3)));
      this. tasksDay4$ = this.tasks$.pipe(map(tasks => tasks.filter(t => t.day === 4)));
      this. tasksDay5$ = this.tasks$.pipe(map(tasks => tasks.filter(t => t.day === 5)));

    }

  

  // sendUpdates(
  //   allTasks,
  //   tasks,
  //   allGoals,
  //   t1,
  //   t2,
  //   t3,
  //   t4,
  //   t5
  // ) {
  //   this.allTasksSubject.next([...allTasks]);
  //   this.tasksSubject.next([...tasks]);
  //   this.goalsSubject.next([...allGoals]);
  //   this.tasksDay1Subject.next([...t1]);
  //   this.tasksDay2Subject.next([...t2]);
  //   this.tasksDay3Subject.next([...t3]);
  //   this.tasksDay4Subject.next([...t4]);
  //   this.tasksDay5Subject.next([...t5]);
  // }

  calculatePastDue(tasks: Task[]) {
    return  tasks.map(t => {
      return {
        ...t,
        pastDue: t.pastDue + this.dateDifference(new Date(), new Date(t.createdDate))
      }
    });
  }

  sortTasksAndGoals(t,g) {
    const nonGoalTasks = t.filter(t => !t.goalId);
    t = nonGoalTasks.concat(this.goalTaskFilter(t, g));
    t = this.fullySortNonCompletedTasks(t);
    return t;
  }

  incrementDaysForTasks(hours: number, taskList: Task[]) {
    let dayIterator = 1;
    const minutesADay = hours * 60;
    let remainingMinutes = minutesADay;
    for(let i = 0, len = taskList.length; i < len; i++) { 

      if((remainingMinutes - taskList[i].minutes) >= -1) {
        remainingMinutes -= taskList[i].minutes;
        taskList[i].day = dayIterator;
      } else {
          taskList[i].day = ++dayIterator;
          remainingMinutes = minutesADay;
      }
    }
    return taskList;
  }


  fullySortNonCompletedTasks(tasks) {
    return tasks.filter(task => task.completed === 0).sort((a,b) => {
      if(a.goalId && b.goalId) return 0//don't resort goal-based task amongst themselves
      return (b.priority + b.difficulty + b.urgency + b.pastDue) - (a.priority + a.difficulty + a.urgency + a.pastDue);
    });
  }

  createIdea(event) {
    this.backend.addIdea({title: event.title, createdDate: moment().format("MM/DD/YYYY")});
    this.backend.delete(event);
  }

  markTaskComplete(event) {
    //this will update the task as completed 

      let awards;

      event.completed = 1;
      event.completedDate = moment().format('DD/MM/YYYY');
      event.completedTime = moment().format('hA');
      try {
        awards = this.backend.addMetric(event, "completion");
      } catch (error) {
          console.log({error}) 
      }
    
      this.updateAllTasks(event);
    
      this.handleGoalUpdates(index, [...this.tasks], this.goals);
      // this.tasks.splice(index,1);
   
  }


  async addInitialTask() {
    const modal = await this.modalController.create({
      component: TaskEntryComponent,
      cssClass: 'task-entry'
    });
    modal.onDidDismiss()
      .then((data) => {
        const result = data['data']; 
        if(result.id) this.backend.addMetric(this.backend.addTask(result), "creation")
        // this.tasks.push(result);
        // this.sendUpdates( 
        //   this.allTasks,
        //   this.tasks,
        //   this.goals,
        //   this.tasksDay1,
        //   this.tasksDay2,
        //   this.tasksDay3,
        //   this.tasksDay4,
        //   this.tasksDay5);
    });


  return await modal.present();
  
  }

  async addTask(milestone?:Goal, goal?:Goal) {
    const modal = await this.modalController.create({
      component: TaskEntryComponent
    });
    modal.onDidDismiss()
      .then((data) => {
        const result = data['data']; 
        if(result.id) {
          if(goal) {
            result['goalId'] = milestone.id;
            result['parentGoalTitle'] = goal.title;
            result['milestoneTitle'] = milestone.title;

          }
          this.backend.addTask(result);
          this.tasks.push(result);
          this.sortDays(5,[...this.sortTasksAndGoals([...this.tasks], [...this.goals])]);
         
          try {
            this.backend.addMetric(result, "creation");
    
          } catch (error) {
              console.dir(error);
          }
          
       
         }

    });


  return await modal.present();
  
  }

  async addGoal() {
    const modal = await this.modalController.create({
      component: GoalEntryComponent,
      cssClass: 'goal-entry'
    });
    modal.onDidDismiss()
      .then((data) => {
        const result = data['data']; 
        console.dir(result);
        if(result) {
          const returnedGoals = this.backend.addGoals(result.goalsToSubmit);
          const returnedTasks = this.backend.addTasks(result.tasksToSubmit);
          for(let i=0; i<result.goalsToSubmit.length; i++) this.goals.push(result.goalsToSubmit[i]);
          for(let j=0; j<result.tasksToSubmit.length; j++) this.tasks.push(result.tasksToSubmit[j]);

          console.dir(this.tasks);
          
          const nonGoalTasks = this.tasks.filter(t => !t.goalId);
          this.tasks = [...nonGoalTasks.concat(this.goalTaskFilter([...this.tasks], [...this.goals]))];
          this.tasks = [...this.fullySortNonCompletedTasks([...this.tasks])];

          console.dir(this.tasks);

          this.sortDays(5,[...this.tasks]);


        }

    });


  return await modal.present();
  
  }

  async addMilestone(goalParent) {
    const modal = await this.modalController.create({
      component: MilestoneEntryComponent,
      cssClass: 'goal-entry',
      componentProps: {goalParent}
    });
    modal.onDidDismiss()
      .then((data) => {
        const result = data['data']; 
        if(result !== null) {
          const returnedGoals = this.backend.addGoals(result.goalToSubmit);
          const returnedTasks = this.backend.addTasks(result.tasksToSubmit);
        }
        // this.sendUpdates( 
        //   this.allTasks,
        //   this.tasks,
        //   this.goals,
        //   this.tasksDay1,
        //   this.tasksDay2,
        //   this.tasksDay3,
        //   this.tasksDay4,
        //   this.tasksDay5);
    });


  return await modal.present();
  
  }

  async editGoal(goalToEdit) {
    // const modal = await this.modalController.create({
    //   component: GoalEntryComponent,
    //   componentProps:goalToEdit,
    //   cssClass: 'goal-entry'
    // });
    // modal.onDidDismiss()
    //   .then((data) => {
    //     const result = data['data']; 
    //     if(result !== null) {
    //       const returnItem = this.backend.updateGoal(result);
    //     }
    const returnItem = this.backend.updateGoals([goalToEdit]);
        // this.sendUpdates( 
        //   this.allTasks,
        //   this.tasks,
        //   this.goals,
        //   this.tasksDay1,
        //   this.tasksDay2,
        //   this.tasksDay3,
        //   this.tasksDay4,
        //   this.tasksDay5);
    // });
    
    //  return await modal.present();

   }

  async editItem(data,type) {
    console.dir(arguments);
    const modal = await this.modalController.create({
      component: ItemEditComponent,
      cssClass: 'goal-entry',
      componentProps: {data,type}
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data);
        const result = data.data; 
        if(result) {
          switch (type) {
            case 'task':
              const returnItem = this.backend.updateTask(result);
              this.tasks.splice(this.tasks.findIndex(t=> t.id === result.id), 1, result);
              break;
            case 'goal':
              this.backend.updateGoals([result]);
              this.goals.splice(this.goals.findIndex(t=> t.id === result.id), 1, result);
              break;
          }
          
          this.sortDays(5,[...this.tasks]);
        }
    });
    
     return await modal.present();

   }

   deleteTask(event) {
     this.tasks.splice(this.tasks.findIndex(task => task.id === event.id),1);
     const returnItem = this.backend.delete(event);

     this.sendUpdates( 
      this.allTasks,
      this.tasks,
      this.goals,
      this.tasksDay1, 
      this.tasksDay2,
      this.tasksDay3,
      this.tasksDay4,
      this.tasksDay5);
  
   }

   deleteGoal(g,m) {
     console.log({arguments});
     let tasks;

      m.forEach(g => {
        tasks = g.tasks;
        tasks.forEach((t) => {
          this.tasks.splice(this.tasks.findIndex(tasks => tasks.id === t.id),1);
          this.backend.delete(t);
        });

        this.goals.splice(this.goals.findIndex(goals => goals.id === g.id),1);
        this.backend.deleteGoal(g)
      });
      this.goals.splice(this.goals.findIndex(goal => goal.id === g.id),1);
      this.backend.deleteGoal(g);

    this.sendUpdates( 
     this.allTasks,
     this.tasks,
     this.goals,
     this.tasksDay1, 
     this.tasksDay2,
     this.tasksDay3,
     this.tasksDay4,
     this.tasksDay5);
 
  }

  updateAllTasks(event) {
    this.backend.updateTasks(event || [...this.tasks]);

    // this.sendUpdates( 
    //   this.allTasks,
    //   event,
    //   this.goals,
    //   this.tasksDay1,
    //   this.tasksDay2,
    //   this.tasksDay3,
    //   this.tasksDay4,
    //   this.tasksDay5);
  }


  dateDifference(d1,d2) {
    const diff = moment(d1).diff(moment(d2), 'days'); 
    return diff || 0;
  }

  handleGoalUpdates(index:number, tasks, goals) {
    if(goals.length > 0) {
      const goalsToUpdate = [];

      //is this a milestone task
      const associatedMilestone = goals.find(g => tasks[index].goalId === g.id);

      if(associatedMilestone) {
        const associatedGoal = goals.find(g => g.id === associatedMilestone.parentGoal);
  
        //check if milestone is done
        associatedMilestone.completed = this.checkIfMilestoneDone(tasks[index].goalId, [...tasks],[...goals]);
        //check if parent goal is done
        associatedGoal.completed = this.checkIfGoalDone(associatedMilestone, [...goals]);
  
        if(associatedMilestone.completed) goalsToUpdate.push(associatedMilestone);
        if(associatedGoal.completed) goalsToUpdate.push(associatedGoal);
  
        this.backend.updateGoals([...goalsToUpdate]);
      } else {
         return null;
      }
     

    }
  }

  checkIfMilestoneDone(taskGoalId: string, tasks: Task[], goals: Goal[]) : number {
    let currentTask;
    let complete = 1;
    const milestoneInQuestion = goals.find(goal => goal.id === taskGoalId);
    // console.dir(milestoneInQuestion);
    milestoneInQuestion.taskChildren.forEach( currentTaskId => {
      currentTask = tasks.find(task => task.id === currentTaskId);
      if(currentTask && !currentTask.completed) {
   
        complete = 0; 
        return complete;
      } else {
        // console.log(`Couldn't find ${currentTaskId} in`);
        // console.dir(tasks);
      } 
    })
  
    return complete;
  
  }

  checkIfGoalDone(associatedMilestone:Goal, goals: Goal[]) : number {

    let complete = 1;
    const goalInQuestion = goals.find(goal => goal.id === associatedMilestone.parentGoal);
    const milestonesInQuestion = goals.filter(goal => goal.parentGoal === goalInQuestion.id)
    console.log({milestonesInQuestion});
    milestonesInQuestion
      .forEach(milestone => {
        if(!milestone.completed) {
          complete = 0;
          return complete;
        }
      })
      return complete;
    
    // goalInQuestion.taskChildren.forEach( milestoneId => {
    //   milestone = this.tasks.find(task => task.id === milestoneId);
    //   if(milestone && !milestone.completed) {
    //     console.log("Goal Not completed yet");
    //     console.dir(goalInQuestion);
    //     complete = 0;
    //   } 
    // })
  
  }

  
  
  goalTaskFilter(taskList: Task[], goals: Goal[]) {

      console.log({taskList});

    if(goals.length === 0) return []; //no need to find goal related tasks if they don't exist

    //get most prioritized goal
   const sortedFilteredGoals = goals
                                .filter(goal => !goal.completed && goal.parentGoal === null)                          
                                 .sort((a,b) => {
                                     return (b.priority + b.difficulty + b.urgency) - (a.priority + a.difficulty + a.urgency);
                                  })
                                  
  
    //get the milestones within the most prioritized goal
    const filteredMilestones = goals
    .filter(goal => !goal.completed && goal.parentGoal === sortedFilteredGoals[0].id);
    
      //get the most prioritized milestone within that goal
    const sortedFilteredMilestones = filteredMilestones
        .sort((a,b) => {
          return (b.priority + b.difficulty + b.urgency) - (a.priority + a.difficulty + a.urgency);
         })
         
         if(sortedFilteredMilestones.length > 0) {
           console.dir(sortedFilteredMilestones);
          const filteredTasks = taskList.filter(t => t.goalId);
          console.log({filteredTasks});
          const list = filteredTasks.filter(t => t.goalId === sortedFilteredMilestones[0].id);
          console.log({list});
         return list;
  
         } else {
            return [];
         }
         
     
  }


  async showAwards() {
    const modal = await this.modalController.create({
      component: ShowAwardComponent,
      // cssClass: 'show-award'
    });

    return await modal.present();

  }

  addIdea() {
    console.dir(this.idea.value);
    this.backend.addIdea({title: this.idea.value, createdDate: moment().format("MM/DD/YYYY")});
    this.ideaForm.controls['idea'].setValue(null);
  }

  async createEvent(tasks) {
    const modal = await this.modalController.create({
      component: DateTimeEntryComponent 
    });
    modal.onDidDismiss()
      .then((data) => {
        console.dir(data);
        const result = data['data']; 
        if(result.date) { 
          console.dir(result);
          console.log(new Date(`${result.date}`));
         
          try {
            this.auth.insertEvents(tasks,result.date, result.buffer);
    
          } catch (error) {
              console.dir(error);
          }
          
       
         }

    });


  return await modal.present();
  
  }

  get idea() {
    return this.ideaForm.get('idea');
  }


  get loggedIn() {
    return !!this.auth.user;
  }

  get filterTags() {
    return this.tags;
  }




  ngOnDestroy() {
    if(this.settingsSub) {
      this.settingsSub.unsubscribe();
    }
    if(this.taskSub) this.taskSub.unsubscribe();
    if(this.daySub) this.daySub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.goalsSub) this.goalsSub.unsubscribe();

  }


}
 