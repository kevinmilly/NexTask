import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';

import * as moment from "moment";


class Variation {
  constructor(public amount: number, public variant: number[]) { }
}

class CompletionTime {
  constructor(public amount: number, public hour: string) { }
}


@Component({
  selector: 'metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {

  graphDate = "thisWeek";

  difficultyPossiblities = [
     `Mindless`,
     `Low`,
     `Average`,
     `High`,
     `Intense`
  ]
  importancePossiblities = [
      `Not Important`,
      `Low Priority`,
      `Important`,
      `Very Important`,
      `Critical`
  ]
  urgencyPossiblities = [
    `Low`,
    `Medium`,
    `Elevated`,
    `High`,
    `Immediate`
  ]

  variations = [];
  completionTimes = [];


    // Pie
    public pieWeekCompleteLabels: string[] = [];
    public pieWeekInCompleteLabels: string[] = [];
    public pieMonthCompleteLabels: string[] = [];
    public pieMonthInCompleteLabels: string[] = [];
    public pieLastWeekCompleteLabels: string[] = [];
    public pieLastWeekInCompleteLabels: string[] = [];


    public pieChartOptions: ChartOptions = {
      responsive: true,
    };
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;



  // public pieChartColors = [
  // {
  //   backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(191, 191, 63,0.3)'],
  // },

  public pieWeekCompleteChartData: number[] = [];
  public pieWeekInCompleteChartData: number[] = [];

  public pieMonthCompleteChartData: number[] = [];
  public pieMonthInCompleteChartData: number[] = [];

  public pieLastWeekCompleteChartData: number[] = [];
  public pieLastWeekInCompleteChartData: number[] = [];

  thisWeekCompleteVariations: any[] = [];
  lastWeekCompleteVariations: any[] = [];
  thisMonthCompleteVariations: any[] = [];

  thisWeekCompletionTimes: any[] = [];
  lastWeekCompletionTimes: any[] = [];
  thisMonthCompletionTimes: any[] = [];


  tasks:Task[] = [];
  goals: Goal[] = [];

  lastWeekToughestTask: Task;
  lastWeekMostImportantTask: Task;
  lastWeekMostUrgentTask: Task;

  thisWeekToughestTask: Task;
  thisWeekMostImportantTask: Task;
  thisWeekMostUrgentTask: Task;

  thisMonthToughestTask: Task;
  thisMonthMostImportantTask: Task;
  thisMonthMostUrgentTask: Task;

  taskSub: Subscription;
  goalSub: Subscription;
  type = 'complete';

  constructor(private taskManage : TaskManagementService, private cdRef:ChangeDetectorRef) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    
    this.taskSub = this.taskManage.allTasks$
                    .subscribe( tasks => {

                      this.tasks = tasks;
                 
                      this.lastWeekToughestTask = this.tasks
                          .filter(t => this.lastWeek(t.createdDate))
                          .sort((a,b) => b.difficulty - a.difficulty)[0];
                      this.thisWeekToughestTask = this.tasks
                          .filter(t => this.currentWeek(t.createdDate))
                          .sort((a,b) => b.difficulty - a.difficulty)[0];
                      this.thisMonthToughestTask = this.tasks
                          .filter(t => this.currentMonth(t.createdDate))
                          .sort((a,b) => b.difficulty - a.difficulty)[0];

                      this.thisWeekMostImportantTask = this.tasks
                          .filter(t => this.lastWeek(t.createdDate))
                          .sort((a,b) => b.priority - a.priority)[0];
                      this.thisMonthMostImportantTask = this.tasks
                          .filter(t => this.currentWeek(t.createdDate))
                          .sort((a,b) => b.priority - a.priority)[0];
                      this.lastWeekMostImportantTask = this.tasks
                          .filter(t => this.currentMonth(t.createdDate))
                          .sort((a,b) => b.priority - a.priority)[0];

                      this.lastWeekMostUrgentTask = this.tasks
                          .filter(t => this.lastWeek(t.createdDate))
                          .sort((a,b) => b.urgency - a.urgency)[0];
                      this.thisWeekMostUrgentTask = this.tasks
                          .filter(t => this.currentWeek(t.createdDate))
                          .sort((a,b) => b.urgency - a.urgency)[0];
                      this.thisMonthMostUrgentTask = this.tasks
                          .filter(t => this.currentMonth(t.createdDate))
                          .sort((a,b) => b.urgency - a.urgency)[0];     

                      this.lastWeekCompleteVariations = this.organizeVariations(tasks.filter(t => this.lastWeek(t.createdDate)));
                      this.thisWeekCompleteVariations = this.organizeVariations(tasks.filter(t => this.currentWeek(t.createdDate)));
                      this.thisMonthCompleteVariations = this.organizeVariations(tasks.filter(t => this.currentMonth(t.createdDate)));
                      console.dir(this.thisMonthCompleteVariations);
                      
                      this.lastWeekCompletionTimes = this.organizeCompletionTimes(tasks.filter(t => this.lastWeek(t.completedDate)));
                      this.lastWeekCompletionTimes
                        .forEach(com => {
                          this.pieLastWeekCompleteChartData.push(com.amount);
                          this.pieLastWeekCompleteLabels
                              .push(com.hour);
                        });
                        this.thisWeekCompletionTimes = this.organizeCompletionTimes(tasks.filter(t => this.currentWeek(t.completedDate)));
                        this.thisWeekCompletionTimes
                        .forEach(com => {
                          this.pieWeekCompleteChartData.push(com.amount);
                          this.pieWeekCompleteLabels
                              .push(com.hour);
                        });
                        console.dir(this.thisWeekCompletionTimes);
                        this.thisMonthCompletionTimes = this.organizeCompletionTimes(tasks.filter(t => this.currentMonth(t.completedDate)));
                        this.thisMonthCompletionTimes
                        .forEach(com => {
                          this.pieMonthCompleteChartData.push(com.amount);
                          this.pieMonthCompleteLabels
                              .push(com.hour);
                        });
                      
                      this.cdRef.detectChanges();
                    })
  }

  
  organizeVariations(unAlteredTasks: Task[]): Variation[] {
    let varyTemp;
        const complete = unAlteredTasks.filter(t => t.completed);
        const variations:Variation[] = [];
        let foundComplete = -1;

        complete.forEach( c=> {
           foundComplete = this.alreadyAddedToVariation(variations, c);
          if(foundComplete === -1) { //didn't find it in there
            varyTemp = new Variation(1,[c.difficulty,c.priority,c.urgency])

            variations.push(varyTemp);
          } else {
               variations[foundComplete].amount++;
          }
        })

        return variations.sort((a,b) => a.amount - b.amount);
    
    
  }

  organizeCompletionTimes(unAlteredTasks: Task[]): CompletionTime[] {
    let timeTemp;
        const complete = unAlteredTasks.filter(t => t.completed);
        const completionTimes:CompletionTime[] = [];
        let foundComplete = -1;

        complete.forEach( c=> {
           foundComplete = this.alreadyAddedToCompletions(completionTimes, c);
          if(foundComplete === -1) { //didn't find it in there
            timeTemp = new CompletionTime(1,c.completedTime)

            completionTimes.push(timeTemp);
          } else {
               completionTimes[foundComplete].amount++;
          }
        })

        return completionTimes.sort((a,b) => a.amount - b.amount);
    
    
  }

  //a helper method for organizeVariations, returns true if the task combo has already been added
  alreadyAddedToVariation(vary:Variation[], task: Task): number {
   if(vary.length < 1) return -1;
    const foundIndex = vary.findIndex(v => {
        return v.variant.toString() ===  `${task.difficulty},${task.priority},${task.urgency}`;
       
    });
    return foundIndex;
  }

  alreadyAddedToCompletions(com:CompletionTime[], task: Task): number {
    if(com.length < 1) return -1;
     const foundIndex = com.findIndex(t => t.hour === task.completedTime);
     return foundIndex;
   }

  idfConvert(format, number) { 
    if(format === 'importance') {
      switch(number) {
        case 1:
        
          return `Low Prioirty`;
        case 2:
        
          return `Medium Prioirty`;
        case 3: 
      
          return `High Prioirty`;
        case 4:
    
          return `Critical Prioirty`;
        case 5:
  
          return `Non-Negotiable Prioirty`;
        default:

          return `Non-Negotiable Prioirty`;
      }
    } else if(format === 'difficulty') {
      switch(number) {
        case 1:
        
          return `Mindless Difficulty`;
        case 2:
        
          return `Low Difficulty`;
        case 3: 
      
          return `Moderate Difficulty`;
        case 4:
    
          return `High Difficulty`;
        case 5:
  
          return `Intense Difficulty`;
        default:

          return `Intense Difficulty`;
      }
    } else {
       
        switch(number) {
          case 1:
        
            return `Low Urgency`;
          case 2:
          
            return `Medium Urgency`;
          case 3: 
        
            return `Elevated Urgency`;
          case 4:
      
            return `High Urgency`;
          case 5:
    
            return `Immediate Urgency`;
          default:
  
            return `Immediate Urgency`;
        }
    }
  
  
}

stringifyVariations(v: number[]) : string {
  return `${this.idfConvert('difficulty', v[0])},
  ${this.idfConvert('importance', v[1])},
   ${this.idfConvert('urgency', v[2])}`
}


currentMonth(dateToCheck) {
  return moment.utc(dateToCheck).isSame(new Date(), 'month'); //true if dates are in the same month
}

currentWeek(dateToCheck) {
  const zeroDaysAgo = this.atimeAgo(new Date(),0)
  return moment.utc(dateToCheck).isSame(zeroDaysAgo, 'week'); //true if dates are in the same week
}

lastWeek(dateToCheck) {
  const sevenDaysAgo = this.atimeAgo(new Date(),7)
  // console.log(`Is ${dateToCheck} in the same week as ${sevenDaysAgo}?`);
  return moment.utc(dateToCheck).isSame(sevenDaysAgo, 'week'); //true if dates are in the same week
}

atimeAgo(date,days) {
  days = 7; // Days you want to subtract
  return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));

}

  ngOnDestroy() { 
    if(this.taskSub) {
      this.taskSub.unsubscribe();
    }
  }

}

