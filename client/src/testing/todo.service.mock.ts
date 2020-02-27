import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      status: true,
      body: 'lorem ipsum',
      category: 'video games',
    },
    {
      _id: 'pat_id',
      owner: 'Pat',
      status: false,
      body: 'Being specific',
      category: 'software design',
    },
    {
      _id: 'jamie_id',
      owner: 'Jamie',
      status: true,
      body: 'Fixing issues',
      category: 'homework',
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { owner?: string, status?: boolean, body?: string, category?: string }): Observable<Todo[]> {
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
