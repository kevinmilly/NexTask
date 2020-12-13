import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';
import { TaskManagementService } from 'src/app/shared/services/task-management.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';



class Variation {
  constructor(public amount: number, public variant: number[]) { }
}


@Component({
  selector: 'metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {


  difficultyPossiblities = [
     `Mindless`,
     `Easy`,
     `Average`,
     `Involved`,
     `Deep Focus`
  ]
  importancePossiblities = [
      `Not Important`,
      `Low Priority`,
      `Important`,
      `Very Important`,
      `Critical`
  ]
  urgencyPossiblities = [
    `Not Urgent`,
    `Somewhat Urgent`,
    `Urgent`,
    `Very Urgent`,
    `Get it Done Now!`
  ]

  variations = [];
    // Pie
    public pieCompleteLabels: string[] = [];
    public pieInCompleteLabels: string[] = [];

    public pieChartOptions: ChartOptions = {
      responsive: true,
    };
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;



  // public pieChartColors = [
  // {
  //   backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(191, 191, 63,0.3)'],
  // },

  public pieCompleteChartData: number[] = [];
  public pieInCompleteChartData: number[] = [];



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

                      console.log({tasks});
                      
                      this.organizeVariations(tasks,'complete')
                        .forEach(variation => {
                          this.pieCompleteChartData.push(variation.amount);
                          this.pieCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                      
                        this.organizeVariations(tasks,'incomplete')
                        .forEach(variation => {
                          this.pieInCompleteChartData.push(variation.amount);
                          this.pieInCompleteLabels
                              .push(this.stringifyVariations(variation.variant));
                        });
                        console.dir(this.pieInCompleteChartData);
                        this.cdRef.detectChanges();
                    })
  }

  
  organizeVariations(unAlteredTasks: Task[], type:string): Variation[] {
 
    switch(type) {
      case 'complete':
        const complete = unAlteredTasks.filter(t => t.completed);
        const variations:Variation[] = [];

        complete.forEach( c=> {
          const [bool, addend] = this.alreadyAddedToVariation(variations, c);
          console.log({bool});
          if(!bool) { //didn't find it in there
            variations.push(new Variation(1,[c.difficulty,c.priority,c.urgency]));
          } else {
               variations[addend].amount++;
          }
        })
        console.log({variations});
        return variations;
      case 'incomplete':
        const incomplete = unAlteredTasks.filter(t => !t.completed);
        const variationsIncomplete:Variation[] = [];
        console.log({incomplete});
        incomplete.forEach( c=> {
          const [bool, addend] = this.alreadyAddedToVariation(variationsIncomplete, c);
          if(!bool) { //didn't find it in there
         
            variationsIncomplete.push(new Variation(1,[c.difficulty,c.priority,c.urgency]));
          } else {
               console.log({addend});
               variationsIncomplete[addend].amount++;
          }
        })
       
        return variationsIncomplete;
    }
    
  }

  //a helper method for organizeVariations, returns true if the task combo has already been added
  alreadyAddedToVariation(vary:Variation[], task: Task): [boolean, number] {
   const foundIndex = vary.findIndex(v => {
      v.variant.toString() ===  `${task.difficulty}${task.priority}${task.urgency}`;
   });

   const foundBool = !foundIndex;
   const found = foundIndex;

    return [foundBool, found];

  }

  idfConvert(format, number) {
    if(format === 'importance') {
      switch(number) {
        case 1:
        
          return `Not Important`;
        case 2:
        
          return `Low Priority`;
        case 3: 
      
          return `Important`;
        case 4:
    
          return `Very Important`;
        case 5:
  
          return `Critical`;
        default:

          return `Critical`;
      }
    } else if(format === 'difficulty') {
      switch(number) {
        case 1:
        
          return `Mindless`;
        case 2:
        
          return `Easy`;
        case 3:
      
          return `Average`;
        case 4:
    
          return `Involved`;
        case 5:
  
          return `Deep Focus`;
      }
    } else {
       
        switch(number) {
          case 1:
          
          return `Not Urgent`;
        case 2:
        
          return `Somewhat Urgent`;
        case 3:
      
          return `Urgent`;
        case 4:
    
          return `Very Urgent`;
        case 5:
  
          return `Get it Done Now!`;
        default:

          return 'Get It Done Now!';
        }
    }
  
}

stringifyVariations(v: number[]) : string {
  return `${this.idfConvert('difficulty', v[0])}
  ${this.idfConvert('importance', v[1])}
   ${this.idfConvert('urgency', v[2])}`
}

  ngOnDestroy() { 
    if(this.taskSub) {
      this.taskSub.unsubscribe();
    }
  }

}

