import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/shared/models/goal.model';
import {AbstractControlDirective, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Task } from 'src/app/shared/models/task.model';
import { BackendService } from 'src/app/shared/services/backend.service';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-goal-entry',
  templateUrl: './goal-entry.component.html', 
  styleUrls: ['./goal-entry.component.scss']
})
export class GoalEntryComponent implements OnInit {

  goalsToSubmit: Goal[] =[];
  tasksToSubmit: Task[] = [];

  goalTitle = "";
  goalDeadline= moment().add(1, 'M').format("MM/DD/YYYY");
  // goalDescription = "";
  goalPriority = 3;
  goalUrgency = 3; 
  goalDifficulty = 3;
  goalTag = ""; 


  goalForm: FormGroup;

  priorities = [
    {
      text: "Not Important", 
      number: 1
    },
    { 
      text: "Low Priority",  
      number: 2
    },
    {
      text: "Important", 
      number: 3
    },
    {
      text: "Very Important", 
      number: 4
    },
    {
      text: "Critical",
      number: 5
    }
  ]

  
  difficulty = [
    {
      text: "Mindless", 
      number: 1
    },
    {
      text: "Easy", 
      number: 2
    },
    {
      text: "Average", 
      number: 3
    },
    {
      text: "Involved", 
      number: 4
    },
    {
      text: "Deep Focus",
      number: 5
    }
  ]

  urgencyLevels = [
    {
      text: "Not Urgent", 
      number: 1
    },
    {
      text: "Kinda Urgent", 
      number: 2
    },
    {
      text: "Urgent", 
      number: 3
    },
    {
      text: "Very Urgent", 
      number: 4
    },
    { 
      text: "Get it Done Now!",
      number: 5
    }
  ]
  

  constructor(
    private fb: FormBuilder, 
    private backend: BackendService,
    public modalController: ModalController,
    ) { }

  ngOnInit(): void {

    //an array of Goals
    this.goalForm = this.fb.group({
      goalArray: this.fb.array([
        this.createNewGoal()
     ])
   })
    console.dir(this.getTaskChildren(this.goalArray.controls[0]));


  }

  get goalArray(): FormArray {
    const array = this.goalForm.get('goalArray') as FormArray;
    // console.dir(array);
    return array;
  }

  getTaskChildren(individualGoal):FormGroup[] {
    const array = individualGoal.controls.taskChildren.controls;

    return array;
  } 

  //adds another task to the goal
  addGoalChild(goal, index) {
    this.getTaskChildren(goal).splice(index+1, 0, this.createNewTask());
    console.log("Adding a task: ");
    console.dir(goal);
    console.dir(this.goalArray);
  }

  deleteTask(goal, index) {
    if(index === 0) return;
    this.getTaskChildren(goal).splice(index,1);
  }

  deleteGoal(index) {
    if(index === 0) return;
    this.goalArray.removeAt(index);
  }

  //creates child of the task, promoting the task to a goal
  addTaskChild(task,formerTaskIndex, arr) {
 
    this.goalArray.push(this.createNewGoal(task));

    arr.pop();

    if(arr.length === 0) {
      console.log("adding another goal");
      arr.push(this.createNewTask())
    }


  }

  submitGoals() {
    let goalId;
    let formattedTaskChildren;
    const parentId = this.idGenerator();
    console.dir(this.goalArray);
    this.goalArray.controls.forEach((group: FormGroup, i) => {
      console.dir(group);
      goalId = this.idGenerator();
      if(this.getTaskChildren(group).length > 0) {
        this.gatherTasksToSubmit(group,goalId);
      }
      this.gatherGoalsToSubmit(group,goalId,parentId);
  
    }); 

    //add the prime goal
    this.goalsToSubmit.push(
      new Goal(
        this.goalTitle,
        this.goalDeadline,
        this.goalPriority,
        this.goalDifficulty,
        this.goalUrgency,
        this.goalTag,
        null,
        parentId,
        null
      )
    )

    this.modalController.dismiss({
      'dismissed':true,
      goalsToSubmit: [...this.goalsToSubmit],
      tasksToSubmit:[...this.tasksToSubmit]
    })


  }

  cancel() {
    console.log(`Cancelled!`);
    this.modalController.dismiss({
      'dismissed':true
    })
  }

  gatherTasksToSubmit(group, goalId: string) {
    console.log("Group passed into gatherTasks is:");
    console.dir(group.value);
    this.getTaskChildren(group).forEach(task => {
      const {title, description, minutes, priority,difficulties,urgency,tag} = task.value;
        this.tasksToSubmit.push(
          new Task(
            this.idGenerator(), 
            title, 
            description,
            minutes, 
            priority,
            difficulties,
            urgency,
            tag,
            goalId,
            moment().format("MM/DD/YYYY"),
            group.get("title").value,//milestone title
            this.goalTitle //parent goal title
            )
        )
        console.log(`Assigned the goal id ${goalId} and the milestone title ${group.get("title").value} to the task ${title}`);
      });
      console.log(`Task to submit are : `);
      console.dir(this.tasksToSubmit);
  }

  gatherGoalsToSubmit(group, goalId: string, parentId: string) {
    this.goalsToSubmit.push(
      new Goal(
        group.get("title").value,
        group.get("deadline").value,
        group.get("priority").value,
        group.get("difficulties").value,
        group.get("urgency").value,
        group.get("tag").value,
        [...this.tasksToSubmit.filter(t => t.goalId === goalId)],
        goalId,
        parentId
      )
    )
      console.log(`Assigned the personal goal id ${goalId} to the milestone ${group.get("title").value}`);

        console.log(`Goals to submit are : `);
        console.dir(this.goalsToSubmit);
  }


  idGenerator() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  createNewGoal(task?: FormGroup) {
    return ( task ?
          this.fb.group({
          title: [task.get("title").value, [Validators.required]],
          priority: [task.get("priority").value, [Validators.required, Validators.min(0), Validators.max(5)]],
          difficulties: [task.get("difficulties").value, [Validators.required, Validators.min(0), Validators.max(5)]],
          urgency: [task.get("urgency").value, [Validators.required, Validators.min(0), Validators.max(5)]],
          tag: [task.get("tag").value],
          deadline: [moment().add(1, 'M').format("MM/DD/YYYY"), [Validators.required]],
          show: true,
          taskChildren: this.fb.array([
            this.fb.group({
              title: ['', [Validators.required]],
              description:[''],
              minutes: [10,[Validators.required, Validators.min(0)]],
              priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              tag: ["general", [Validators.required]],
              show: true
            })
          ]),
        }) 
        :
        this.fb.group({
          title: ['', [Validators.required]],
          priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
          urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
          difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
          tag: ["general", [Validators.required]],
          deadline: [moment().add(1, 'M').format("MM/DD/YYYY"), [Validators.required]],
          show: true,
          taskChildren: this.fb.array([
            this.fb.group({
              title: ["", [Validators.required]],
              description:[''],
              minutes: [10,[Validators.required, Validators.min(0)]], 
              priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]], 
              tag: ["general", [Validators.required]],
              show: true
            })
          ]),
        })
      )
    }

    createNewTask() : FormGroup{
     return (
        this.fb.group({
          title: ['', [Validators.required]],
          description: [''],
          minutes: [10,[Validators.required, Validators.min(0)]], 
          priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
          difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
          urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
          tag: ["general", [Validators.required]],
          show: true
        })
    ); 
    }


}