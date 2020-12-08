import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { TaskEditComponent } from '../../ui/task-edit/task-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BackendService } from '../../../shared/services/backend.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import * as moment from "moment";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
}) 
export class TableViewComponent implements OnInit {

  dataSource: MatTableDataSource<Task>;

  taskSub: Subscription;

  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tasks: Task[];
  deviceSize;

  taskColumns: String[] = [
    "title",
    "description",
    "day",
    "minutes",
    "priority",
    "difficulty",
    "urgency",
    "resource",
    "completed",
    "details",
    "complete",
    "delete"
  ];

  columnOptions = new FormControl();

  columnChoices = [
    {value:'title', default:true},
    {value: 'description', default:false},
    {value: 'day', default:true},
    {value:'minutes', default:true},
    {value: 'priority', default:true},
    {value:'difficulty', default:true},
    {value: 'urgency', default:true},
    {value:'resource', default:false},
    {value:'completed', default:true},
    {value:'details', default:true},
    {value:'complete', default:true}, 
    {value:'delete', default:true}
  
  ]

  constructor(public dialog: MatDialog, private backend: BackendService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.taskSub = this.backend.getTasks().valueChanges().subscribe(queue => {
      
      this.route.paramMap.subscribe(params => console.log({params}));
      console.log(`Device size in the tool bar element is ${this.deviceSize}`);
      this.tasks = queue;
      console.dir(this.tasks);

      this.dataSource = new MatTableDataSource<Task>(this.tasks);
      this.applyColumnFilter();
      this.columnOptions.setValue(this.columnChoices.filter(element => element.default).map(element => element.value));


    


    })

  }

  ngAfterViewInit() {
    
    this.taskSub = this.backend.getTasks().valueChanges().subscribe(queue => {

      this.tasks.map(t => {
        return {
          ...t,
          urgency: t.urgency + this.dateDifference(new Date(), new Date(t.createdDate))
        }
      })
   
      this.tasks = queue.sort((a,b) => {
        // console.log(`${(b.priority + b.difficulty)} - ${(a.priority + a.difficulty)}`);
        return (b.priority + b.difficulty + b.urgency) - (a.priority + a.difficulty + a.urgency);
     })

  


      this.dataSource = new MatTableDataSource<Task>(this.tasks);
      this.applyColumnFilter();
      this.columnOptions.setValue(this.columnChoices.filter(element => element.default).map(element => element.value));


      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;


    })

  
  }

  applyfilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyColumnFilter() {

    this.taskColumns = this.columnOptions.value;
  }

  markComplete(task: Task) {
    const index =  this.tasks.findIndex(t => t.id === task.id)
    this.tasks[index].completed === 1 ? this.tasks[index].completed = 0 : this.tasks[index].completed = 1;
    this.tasks[index].completedDate ? this.tasks[index].completedDate = '' : this.tasks[index].completedDate = moment().format('YYYY-MM-DD');
    this.updateAllTasks();
    this.tasks.splice(index,1);

  }

  updateAllTasks() {
    this.backend.updateTasks(this.tasks);
  }


  editZoom(task: Task) {
    console.log({task});
    const dialogRef = this.dialog.open(TaskEditComponent, {
      width: '450px',
      height: '630px',
       data: {task}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('The dialog was closed', result);
        this.editTask(result);
      }
    });
  }

  editTask(event) {
    console.log({event});
    const returnItem = this.backend.updateTask(event);
   //  console.log({returnItem});
   }

   delete(event) {
    if(confirm("Do you legit wanna delete this?")) {
     this.backend.delete(event);
    }
   }

  importanceDifficultyFormat(format, number) {
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
        }
    }
    
  }

  formatDate(date) {
    return moment(date).format('L');
  }

  dateDifference(d1,d2) {
    return moment(d1).diff(moment(d2), 'days');
  }

  ngOnDestroy() {
    if(this.taskSub) {
      this.taskSub.unsubscribe();
    }
  }

  

}
