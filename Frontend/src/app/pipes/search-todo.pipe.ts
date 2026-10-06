import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo';

@Pipe({
  name: 'searchTodo'
})
export class SearchTodoPipe implements PipeTransform {

  transform(todos: Todo[], search: string): Todo[] {

    if (!search) return todos;

    search = search.toLowerCase();

    return todos.filter(todo =>
      todo.title.toLowerCase().includes(search)
    );

  }

}
