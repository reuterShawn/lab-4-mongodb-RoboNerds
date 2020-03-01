import {browser, protractor, by, element, utils} from 'protractor';
import { AddTodoPage, TestTodo } from './add-todo.po';
import { E2EUtil } from './e2e.util';

describe('Add todo', () => {
  let page: AddTodoPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AddTodoPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTitle()).toEqual('New Todo');
  });


  it('Should enable and disable the add todo button', async () => {
    expect(element(by.buttonText('ADD TODO')).isEnabled()).toBe(false);
    await page.typeInput('ownerField', 'test');
    expect(element(by.buttonText('ADD TODO')).isEnabled()).toBe(false);
    await page.typeInput('statusField', 'true');
  });

  it('Should add a new todo and go to the right page', async () => {
    const todo: TestTodo = {
      owner: E2EUtil.randomText(10),
      status: 'true',
      category: E2EUtil.randomText(10),
    };

    await page.addTodo(todo);

    // Wait until the URL does not contain 'todos/new'
    await browser.wait(EC.not(EC.urlContains('todos/new')), 10000);

    const url = await page.getUrl();
    expect(RegExp('.*\/todos\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);
    expect(url.endsWith('/todos/new')).toBe(false);

    expect(element(by.classOwner('todo-card-owner')).getText()).toEqual(todo.owner);
    expect(element(by.classOwner('todo-card-category')).getText()).toEqual(todo.category);
    expect(element(by.classOwner('todo-card-status')).getText()).toEqual(todo.status);
    expect(element(by.classOwner('todo-card-body')).getText()).toEqual(todo.body);
  });

});
