import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { Task } from '../models/task';

@Pipe({
  name: 'searchTask'
})
export class SearchTaskPipe
  implements PipeTransform {

  transform(
    tasks: Task[],
    search: string
  ): Task[] {

    if (!search) {
      return tasks;
    }

    search = search.toLowerCase().trim();

    return tasks.filter(task =>
      task.title
        .toLowerCase()
        .includes(search)
    );
  }
}