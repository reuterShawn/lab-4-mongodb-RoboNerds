import {TodoPage} from './todo-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
    page.navigateTo();
    page.changeView('list');
  });

  it('Should have the correct title', () => {
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  // Testing Owner Filter
  it('Should type something in the owner filter and check that it returned todos with string Fry', () => {
    page.typeInput('todo-owner-input', 'Fry');

    // All of the todos in the list should have the owner we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-owner')).getText()).toEqual('Fry');
    });
  });

  // Testing for Category Filter
  it('Should type something in the category filter and check that it returned todos with string video games', () => {
    page.typeInput('todo-category-input', 'video games');

    // All of the todo list should have the category we are filtering by
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-category')).getText()).toEqual('video games');
    });
  });

 // Testing for Status Filter
  it('Should type something in the status filter and check that it returned todos with true status', () => {
    page.changeView('list');
    page.selectMatSelectValue('todo-status-select', 'true');
// All of the todo list should have the status we are filtering by
    page.getTodoListItems().each(e => {
    expect(e.element(by.className('todo-list-status')).getText()).toEqual('true');
      });
    });


 // Testing for Status Filter
  it('Should type something in the status filter and check that it returned todos with false status', () => {
    page.changeView('list');
    page.selectMatSelectValue('todo-status-select', 'false');

// All of the todo list should have the status we are filtering by
    page.getTodoListItems().each(e => {
    expect(e.element(by.className('todo-list-status')).getText()).toEqual('false');
      });
    });


  // Testing for Body filter
  it('Should type something in the body filter and check that it returned todos with tempor cillum ', () => {
    page.changeView('list');
    page.typeInput('todo-body-input', 'tempor cillum');
// All of the todo list should have the status we are filtering by
    let owner = page.getTodoListItems().map(e => e.element(by.className('todo-list-owner')).getText());

    expect(owner).toContain('Fry');
    expect(owner).toContain('Blanche');

      });
});
