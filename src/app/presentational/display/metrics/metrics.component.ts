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

  thisWeekIncompleteVariations: any[] = [];
  lastWeekIncompleteVariations: any[] = [];
  thisMonthIncompleteVariations: any[] = [];



  tasks:Task[] = [];
  goals: Goal[] = [];

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
                      
                      this.lastWeekCompleteVariations = this.organizeVariations(tasks.filter(t => this.lastWeek(t.completedDate)),'complete');
                      this.lastWeekCompleteVariations
                        .forEach(variation => {
                          this.pieLastWeekCompleteChartData.push(variation.amount);
                          this.pieLastWeekCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        this.thisWeekCompleteVariations = this.organizeVariations(tasks.filter(t => this.currentWeek(t.completedDate)),'complete');
                        this.thisWeekCompleteVariations
                        .forEach(variation => {
                          this.pieWeekCompleteChartData.push(variation.amount);
                          this.pieWeekCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        this.thisMonthCompleteVariations = this.organizeVariations(tasks.filter(t => this.currentMonth(t.completedDate)),'complete');
                        this.thisMonthCompleteVariations
                        .forEach(variation => {
                          this.pieMonthCompleteChartData.push(variation.amount);
                          this.pieMonthCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
            
                
                      
                        this.lastWeekIncompleteVariations = this.organizeVariations(tasks.filter(t => this.lastWeek(t.createdDate)),'incomplete');
                        this.lastWeekIncompleteVariations
                        .forEach(variation => {
                          this.pieLastWeekInCompleteChartData.push(variation.amount);
                          this.pieLastWeekInCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        this.thisWeekIncompleteVariations = this.organizeVariations(tasks.filter(t => this.currentWeek(t.createdDate)),'incomplete');
                        this.thisWeekIncompleteVariations
                        .forEach(variation => {
                          this.pieWeekInCompleteChartData.push(variation.amount);
                          this.pieWeekInCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        this.thisMonthIncompleteVariations = this.organizeVariations(tasks.filter(t => this.currentMonth(t.createdDate)),'incomplete');
                        this.thisMonthIncompleteVariations.forEach(variation => {
                          this.pieMonthInCompleteChartData.push(variation.amount);
                          this.pieMonthInCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        
                        this.cdRef.detectChanges();
                    })
  }

  
  organizeVariations(unAlteredTasks: Task[], type:string): Variation[] {
    let varyTemp;
    switch(type) {
      case 'complete':
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
      case 'incomplete':
        let foundIncomplete = -1;
        
        const incomplete = unAlteredTasks.filter(t => !t.completed);
        const variationsIncomplete:Variation[] = [];
      
        incomplete.forEach( c=> {
           foundIncomplete = this.alreadyAddedToVariation(variationsIncomplete, c);

          if(foundIncomplete === -1) { //didn't find it in there
            varyTemp  = new Variation(1,[c.difficulty,c.priority,c.urgency]);
            // console.log({varyTemp});
            variationsIncomplete.push(varyTemp);
          } else {
   
               variationsIncomplete[foundIncomplete].amount++;
          }
        })
       
        return variationsIncomplete.sort((a,b) => a.amount - b.amount);
    }
    
  }

  //a helper method for organizeVariations, returns true if the task combo has already been added
  alreadyAddedToVariation(vary:Variation[], task: Task): number {
   if(vary.length < 1) return -1;
   
    const foundIndex = vary.findIndex(v => {
        return v.variant.toString() ===  `${task.difficulty},${task.priority},${task.urgency}`;
       
    });


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
  return `${this.idfConvert('difficulty', v[0])}
  ${this.idfConvert('importance', v[1])}
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

