import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { Todo, statusType } from './todo';
import { TodoService } from './todo.service';

describe('Todo service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'id_Blanche',
      owner: 'Blanche',
      status: false,
      body: 'In sunt ex',
      category: 'software design'
    },
    {
      _id: 'id_Barry',
      owner: 'Barry',
      status: false,
      body: 'Ipsum esse',
      category: 'video games'
    },
    {
      _id: 'id_Fry',
      owner: 'Fry',
      status: true,
      body: 'Ullamco irure',
      category: 'homework'
    },
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the users we get from this call to getTodos()
    // should be our set of test users. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoService.todoUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'status\'', () => {

    todoService.getTodos({ status: 'complete'}).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
    );
    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with multiple filter parameters',() => {

    todoService.getTodos({ owner: 'Blanche', category: 'software design', status: 'incomplete' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl)
        && request.params.has('owner') && request.params.has('category') && request.params.has('status')
    );

    // Check that the owner, category, and status parameters are correct
    expect(req.request.params.get('owner')).toEqual('Blanche');
    expect(req.request.params.get('category')).toEqual('software design');
    expect(req.request.params.get('status')).toEqual('incomplete');

    req.flush(testTodos);
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('filterTodos() filters by owner', () => {
    expect(testTodos.length).toBe(3);
    const todoOwner = 'r';
    expect(todoService.filterTodos(testTodos, { owner: todoOwner }).length).toBe(2);
  });

  it('filterTodos() filters by category', () => {
    expect(testTodos.length).toBe(3);
    const todoCategory = 'video games';
    expect(todoService.filterTodos(testTodos, { category: todoCategory }).length).toBe(1);
  });

  it('filterTodos() filters by owner and category', () => {
    expect(testTodos.length).toBe(3);
    const todoCategory = 'video games';
    const todoOwner = 'Fry';
    expect(todoService.filterTodos(testTodos, { owner: todoOwner, category: todoCategory }).length).toBe(0);
  });

  it('addTodo() calls api/todos/new', () => {

    todoService.addTodo(testTodos[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(todoService.todoUrl + '/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testTodos[1]);

    req.flush({id: 'testid'});
  });


});
