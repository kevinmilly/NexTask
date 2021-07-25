import { Pipe, PipeTransform } from "@angular/core";
import { Task } from "src/app/shared/models/task.model";


@Pipe({
    name:'taskHeight'
})
export class TaskHeightPipe implements PipeTransform {
    transform(task:Task) {
        const { priority, difficulty, urgency, pastDue } = task;
        return `${(difficulty + priority + urgency + pastDue) / 2}rem`;
    }

}