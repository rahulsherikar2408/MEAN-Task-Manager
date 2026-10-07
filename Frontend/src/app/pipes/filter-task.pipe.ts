import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { Task } from '../models/task';

@Pipe({
  name: 'filterTask'
})
export class FilterTaskPipe
  implements PipeTransform {

  transform(
    tasks: Task[],
    filter: string
  ): Task[] {

    if (!filter || filter === 'All') {
      return tasks;
    }

    return tasks.filter(
      task => task.status === filter
    );
  }
}