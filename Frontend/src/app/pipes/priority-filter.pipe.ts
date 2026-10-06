import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo';

@Pipe({
  name: 'priorityFilter'
})
export class PriorityFilterPipe implements PipeTransform {

  transform(todos: Todo[], priority: string): Todo[] {

    if (!priority || priority === 'All') {
      return todos;
    }

    return todos.filter(todo => todo.priority === priority);

  }

}
