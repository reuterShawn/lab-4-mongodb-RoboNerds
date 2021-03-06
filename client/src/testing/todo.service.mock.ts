import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, statusType } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'Blanche_id',
      owner: 'Blanche',
      status: false,
      body: 'In sunt esse.',
      category: 'software design'
    },
    {
      _id:  'Fry_id',
      owner: 'Fry',
      status: true,
      body: 'Ipsum esse.',
      category: 'video games'
    },
    {
      _id: 'Barry_id',
      owner: 'Barry',
      status: true,
      body: 'Ullamco irure.',
      category: 'homework'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { owner?: string, status?: statusType, body?: string, category?: string }): Observable<Todo[]> {
    // Just return the test todos regardless of what filters are passed in
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
