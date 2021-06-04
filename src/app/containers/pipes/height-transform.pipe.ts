import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/shared/models/task.model';

@Pipe({
  name: 'height-transform'
})
export class HeightTransformPipe implements PipeTransform {

  transform(task: Task): string {
    return `${(task.difficulty + task.priority + task.urgency + task.pastDue) / 1.15}rem`;
  }

}
