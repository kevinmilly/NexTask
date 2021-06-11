import { Pipe, PipeTransform } from "@angular/core";
import { Task } from "src/app/shared/models/task.model";


@Pipe({
    name:'classPriority'
})
export class ClassPriorityPipe implements PipeTransform {
    transform(task:Task) {
        const { priority, difficulty, urgency, pastDue } = task;

        if ((priority + difficulty + urgency + pastDue) < 4 || (priority + difficulty + urgency + pastDue) === 4) {
            return 'task-item-very-low'
          } else if ((priority + difficulty + urgency + pastDue) < 7 || (priority + difficulty + urgency + pastDue) === 7) {
            return 'task-item-low';
          } else if ((priority + difficulty + urgency + pastDue) < 10 || (priority + difficulty + urgency + pastDue) === 10) {
            return 'task-item-medium';
          } else if ((priority + difficulty + urgency + pastDue) < 12 || (priority + difficulty + urgency + pastDue) === 12) {
            return 'task-item-high';
          } else {
            return 'task-item-very-high';
          }
    }

}