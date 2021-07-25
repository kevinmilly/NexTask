import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { Difficulty, Importance, Urgency } from 'src/app/containers/models/factors.enum';



@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ItemEditComponent implements OnInit {

  itemForm: FormGroup;
  id;
  difficultyLevel: number;
  priorityLevel: number;


  @Input() data
  @Input() type;


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

  constructor(public modalController: ModalController) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    this.id = this.data.id;
    this.itemForm = this.loadItem();
  }

  loadItem(): FormGroup {
    switch (this.type) {
      case 'goal':
        return new FormGroup({
          description: new FormControl(this.data.description, []),
          priority: new FormControl(this.data.priority, [Validators.required, Validators.min(0), Validators.max(5)]),
          difficulties: new FormControl(this.data.difficulty, [Validators.required, Validators.min(0), Validators.max(5)]),
          urgency: new FormControl(this.data.urgency > 5 ? 5 : this.data.urgency, [Validators.required, Validators.min(0), Validators.max(5)]),
          title: new FormControl(this.data.title, [Validators.required, Validators.maxLength(37)]),
          tag: new FormControl(this.data.tag, [Validators.required]),
          deadline: new FormControl(this.data.deadline, [Validators.required])
        });
      case 'task':
        return new FormGroup({
          day: new FormControl(this.data.day, [Validators.required, Validators.min(1), Validators.max(5)]),
          description: new FormControl(this.data.description, []),
          minutes: new FormControl(this.data.minutes, [Validators.required, Validators.min(0)]),
          priority: new FormControl(this.data.priority, [Validators.required, Validators.min(0), Validators.max(5)]),
          difficulties: new FormControl(this.data.difficulty, [Validators.required, Validators.min(0), Validators.max(5)]),
          urgency: new FormControl(this.data.urgency > 5 ? 5 : this.data.urgency, [Validators.required, Validators.min(0), Validators.max(5)]),
          resource: new FormControl(this.data.resource, []),
          title: new FormControl(this.data.title, [Validators.required, Validators.maxLength(37)]),
          tag: new FormControl(this.data.tag, [Validators.required])
        });

    }
  }

  submitItem() {

    switch (this.type) {
      case 'task':
        this.modalController.dismiss({
          id: this.id,
          completed: 0,
          day: this.day.value,
          description: this.description.value,
          minutes: this.minutes.value,
          priority: this.priority.value,
          difficulties: this.difficulties.value,
          urgency: this.urgency.value,
          resource: this.resource.value,
          title: this.title.value,
          tag: this.tag.value
        })
        break;
      case 'goal':
        this.modalController.dismiss({
          id: this.id,
          description: this.description.value,
          priority: this.priority.value,
          difficulties: this.difficulties.value,
          urgency: this.urgency.value,
          title: this.title.value,
          tag: this.tag.value,
          deadline: this.deadline.value
        })
        break;

    }

  }

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }



  get day() { return this.itemForm.get('day'); }
  get description() { return this.itemForm.get('description'); }
  get minutes() { return this.itemForm.get('minutes'); }
  get priority() { return this.itemForm.get('priority'); }
  get urgency() { return this.itemForm.get('urgency'); }
  get difficulties() { return this.itemForm.get('difficulties'); }
  get resource() { return this.itemForm.get('resource'); }
  get title() { return this.itemForm.get('title'); }
  get tag() { return this.itemForm.get('tag'); }
  get deadline() { return this.itemForm.get('deadline'); }


}
