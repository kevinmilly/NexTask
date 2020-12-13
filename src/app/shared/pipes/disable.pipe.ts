import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shouldDisable'
})
export class DisablePipe implements PipeTransform {

  transform(checkIfTrue:boolean): string {
    return checkIfTrue && 'disabled';
  }

}
