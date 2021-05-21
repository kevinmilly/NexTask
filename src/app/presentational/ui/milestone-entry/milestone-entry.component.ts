import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Goal } from 'src/app/shared/models/goal.model';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-milestone-entry',
  templateUrl: './milestone-entry.component.html',
  styleUrls: ['./milestone-entry.component.scss'],
})
export class MilestoneEntryComponent implements OnInit {

  goalsToSubmit: Goal;
  tasksToSubmit: Task[] = [];

  goalForm: FormGroup;

  @Input() goalParent: Goal;

  priorities = [
    {
      text: "Very Low",
      number: 1
    },
    {
      text: "Low",
      number: 2
    },
    {
      text: "Moderate",
      number: 3
    },
    {
      text: "High",
      number: 4
    },
    {
      text: "Very High",
      number: 5
    }
  ]


  difficulty = [
    {
      text: "Very Low",
      number: 1
    },
    {
      text: "Low",
      number: 2
    },
    {
      text: "Moderate",
      number: 3
    },
    {
      text: "High",
      number: 4
    },
    {
      text: "Very High",
      number: 5
    }
  ]

  urgencyLevels = [
    {
      text: "Very Low",
      number: 1
    },
    {
      text: "Low",
      number: 2
    },
    {
      text: "Moderate",
      number: 3
    },
    {
      text: "High",
      number: 4
    },
    {
      text: "Very High",
      number: 5
    }
  ]

  constructor(
    private fb: FormBuilder,
    public modalController: ModalController,
  ) { }

  ngOnInit() {

    this.goalForm = this.createNewGoal();
  }



  importanceDifficultyFormat(format, number) {
    if (format === 'importance') {
      switch (number) {
        case 1:

          return `Low`;
        case 2:

          return `Medium`;
        case 3:

          return `High`;
        case 4:

          return `Critical`;
        case 5:

          return `Non-Negotiable`;
        default:

          return `Non-Negotiable`;
      }
    } else if (format === 'difficulty') {
      switch (number) {
        case 1:

          return `Mindless`;
        case 2:

          return `Low`;
        case 3:

          return `Moderate`;
        case 4:

          return `High`;
        case 5:

          return `Intense`;
        default:

          return `Intense`;
      }
    } else {

      switch (number) {
        case 1:

          return `Low`;
        case 2:

          return `Medium`;
        case 3:

          return `Elevated`;
        case 4:

          return `High`;
        case 5:

          return `Immediate`;
        default:

          return `Immediate`;
      }
    }

  }

  createNewGoal() {
    return (
      this.fb.group({
        id: this.idGenerator(),
        title: ['', [Validators.required, Validators.maxLength(37)]],
        priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        tag: ["general", [Validators.required]],
        deadline: [moment().add(1, 'M').format("MM/DD/YYYY"), [Validators.required]],
        show: true,
        parentGoal: this.goalParent.id,
        taskChildren: this.fb.array([
          this.createNewTask()
        ]),
      })
    )
  }

  createNewTask(goal?: FormGroup): FormGroup {
    return (
      this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(37)]],
        description: [''],
        minutes: [10, [Validators.required, Validators.min(0)]],
        priority: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        difficulties: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        urgency: [2, [Validators.required, Validators.min(0), Validators.max(5)]],
        tag: ["general", [Validators.required]],
        show: true
      })
    );
  }

  deleteTask(index) {
    if (this.goalForm.get('taskChildren').value.length < 1) return;
    this.goalForm.get('taskChildren').value.splice(index, 1);
  }

  addGoalChild() {
    this.goalForm.controls.taskChildren.value.splice(1, 0, this.createNewTask());
  }

  gatherTasksToSubmit() {
    this.taskArray.controls.forEach(task => {
      const { title, description, minutes, priority, difficulties, urgency } = task.value;
      this.tasksToSubmit.push(
        new Task(
          this.idGenerator(),
          title,
          description,
          minutes,
          priority,
          difficulties,
          urgency,
          this.goalForm.controls['tag'].value,
          this.goalForm.controls['id'].value,
          moment().format("MM/DD/YYYY"),
          this.goalForm.controls['title'].value,//milestone title
          this.goalParent.title //parent title
        )
      )

    });

  }

  submitGoals() {
    this.gatherTasksToSubmit();
    const { id, title, priority, urgency, difficulties, tag, deadline, parentGoal } = this.goalForm.value;
    const g = new Goal(id, title, priority, urgency, difficulties, tag, this.tasksToSubmit, deadline, parentGoal);
    this.modalController.dismiss({
      'dismissed': true,
      goalToSubmit: g,
      tasksToSubmit: [...this.tasksToSubmit]
    })


  }


  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }


  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  get taskArray(): FormArray {
    const array = this.goalForm.get('taskChildren') as FormArray;

    return array;
  }

}
