import { Component, OnInit, Inject, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TaskEditComponent implements OnInit {

    taskForm;
    id;
    difficultyLevel: number;
    priorityLevel: number;

    @Input() data
  

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
                      text: "Somewhat Urgent", 
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

  constructor(public modalController: ModalController) {
      this.priorityLevel = this.data.task.priority;
      this.difficultyLevel = this.data.task.difficulty;
      this.id = this.data.task.id;
      this.taskForm = new FormGroup({
        day: new FormControl(this.data.task.day,[Validators.required, Validators.min(1), Validators.max(5)]), 
        description: new FormControl(this.data.task.description,[]), 
        minutes: new FormControl(this.data.task.minutes,[Validators.required, Validators.min(0), Validators.max(59)]), 
        priority: new FormControl(this.data.task.priority,[Validators.required, Validators.min(0), Validators.max(5)]), 
        difficulties: new FormControl(this.data.task.difficulty,[Validators.required, Validators.min(0), Validators.max(5)]), 
        urgency: new FormControl(this.data.task.urgency > 5 ? 5 : this.data.task.urgency,[Validators.required, Validators.min(0), Validators.max(5)]), 
        resource: new FormControl(this.data.task.resource,[]), 
        title: new FormControl(this.data.task.title,[Validators.required, Validators.maxLength(35)]),
        tag: new FormControl(this.data.task.tag,[Validators.required])
      }
    )  
    }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.priorityLevel = this.data.task.priority;
      this.difficultyLevel = this.data.task.difficulty;
  }

  submitTask() {
    // console.dir(this.title);
    this.modalController.dismiss({
      id: this.id,
      completed: 0,
      day: this.day.value,
      description: this.description.value,
      minutes: this.minutes.value,
      priority: this.priority.value,
      difficulties: this.difficulties.value,
      urgency: this.urgency.value,
      // priority: this.priorityLevel,
      // difficulty: this.difficultyLevel,
      resource: this.resource.value,
      title: this.title.value,
      tag: this.tag.value
    })
  }
 


  get day() { return this.taskForm.get('day');}
  get description() { return this.taskForm.get('description');}
  get minutes() { return this.taskForm.get('minutes');}
  get priority() { return this.taskForm.get('priority');}
  get urgency() { return this.taskForm.get('urgency');}
  get difficulties() { return this.taskForm.get('difficulties');}
  get resource() { return this.taskForm.get('resource');}
  get title() { return this.taskForm.get('title');}
  get tag() { return this.taskForm.get('tag');}


}
