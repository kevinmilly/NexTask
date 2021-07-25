import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { BackendService } from '../../../core/services/backend/backend.service';
import { Idea } from '../../../shared/models/idea.model';
import { ModalController } from '@ionic/angular';
import { Importance, Difficulty, Urgency } from 'src/app/containers/models/factors.enum';


@Component({ 
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TaskEntryComponent {



  taskForm = new FormGroup({
    day: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
    description: new FormControl("", []),
    minutes: new FormControl(10, [Validators.required, Validators.min(0)]),
    priority: new FormControl(2, [Validators.required, Validators.min(0), Validators.max(5)]),
    urgency: new FormControl(2, [Validators.required, Validators.min(0), Validators.max(5)]),
    difficulties: new FormControl(2, [Validators.required, Validators.min(0), Validators.max(5)]),
    resource: new FormControl("", []),
    title: new FormControl("", [Validators.required, Validators.maxLength(37)]),
    tag: new FormControl("general", [Validators.required])

  }
  )

  difficultyLevel: number = 1;
  priorityLevel: number = 1;
  urgencyLevel: number = 1;

  ideas: Idea[] = [];
  ideaSub;



  priorities = [
    {
      text: Importance[1],
      number: 1
    },
    {
      text: Importance[2],
      number: 2
    },
    {
      text: Importance[3],
      number: 3
    },
    {
      text: Importance[4],
      number: 4
    },
    {
      text: Importance[5],
      number: 5
    }
  ]


  difficulty = [
    {
      text: Difficulty[1],
      number: 1
    },
    {
      text: Difficulty[2],
      number: 2
    },
    {
      text: Difficulty[3],
      number: 3
    },
    {
      text: Difficulty[4],
      number: 4
    },
    {
      text: Difficulty[5],
      number: 5
    }
  ]

  urgencyLevels = [
    {
      text: Urgency[1],
      number: 1
    },
    {
      text: Urgency[2],
      number: 2
    },
    {
      text: Urgency[3],
      number: 3
    },
    {
      text: Urgency[4],
      number: 4
    },
    {
      text: Urgency[5],
      number: 5
    }
  ]

  constructor(
    public modalController: ModalController,
    private cd: ChangeDetectorRef,
    private backend: BackendService,
  ) { }


  submitTask() {
    this.modalController.dismiss({
      id: this.idGenerator(),
      completed: 0,
      day: this.day.value,
      description: this.description.value,
      minutes: this.minutes.value,
      priority: this.priority.value,
      difficulty: this.difficulties.value,
      urgency: this.urgency.value,
      resource: this.resource.value,
      title: this.title.value,
      createdDate: moment().format("MM/DD/YYYY"),
      tag: this.tag.value,
      pastDue: 0
    })
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  get day() { return this.taskForm.get('day'); }
  get description() { return this.taskForm.get('description'); }
  get minutes() { return this.taskForm.get('minutes'); }
  get priority() { return this.taskForm.get('priority'); }
  get urgency() { return this.taskForm.get('urgency'); }
  get difficulties() { return this.taskForm.get('difficulties'); }
  get resource() { return this.taskForm.get('resource'); }
  get title() { return this.taskForm.get('title'); }
  get tag() { return this.taskForm.get('tag'); }

  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }



  ngOnDestroy() {
    if (this.ideaSub) this.ideaSub.unsubscribe();
  }

}


