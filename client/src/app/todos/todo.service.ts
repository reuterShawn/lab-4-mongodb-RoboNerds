import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoService {
  readonly todoUrl: string = environment.API_URL + 'todo';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { owner?: string, status?: string, category?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status;
      }
      if (filters.category) {
        httpParams = httpParams.set('company', filters.category);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { owner?: string, category?: string }): Todo[] {

    let filteredTodos = todos;

    // Filter by name
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => {
        return todo.owner.toLowerCase().indexOf(filters.owner) !== -1;
      });
    }

    // Filter by category
    if (filters.category) {
      filters.category = filters.category.toLowerCase();

      filteredTodos= filteredTodos.filter(todo => {
        return todo.category.toLowerCase().indexOf(filters.category) !== -1;
      });
    }

    return filteredTodos;
  }

  addTodo(newTodo: Todo): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.todoUrl + '/new', newTodo).pipe(map(res => res.id));
  }
}
