import {TodoPage} from './todo-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('todo list', () => {
  let page: TodoPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new TodoPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('Should type something in the name filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-name-input', 'Lynn Ferguson');

    // All of the todo cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-name')).getText()).toEqual('Lynn Ferguson');
    });
  });

  it('Should type something in the category filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-category-input', 'OHMNET');

    // All of the todo cards should have the category we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-category')).getText()).toEqual('OHMNET');
    });
  });

  it('Should type something partial in the category filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-category-input', 'ti');

    // Go through each of the cards that are being shown and get the categories
    const categories = await page.getTodoCards().map(e => e.element(by.className('todo-card-category')).getText());

    // We should see these categories
    expect(categories).toContain('MOMENTIA');
    expect(categories).toContain('KINETICUT');

    // We shouldn't see these categories
    expect(categories).not.toContain('DATAGENE');
    expect(categories).not.toContain('OHMNET');
  });



  it('Should type something in the age filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-age-input', '27');

    // Go through each of the cards that are being shown and get the names
    const names = await page.getTodoCards().map(e => e.element(by.className('todo-card-name')).getText());

    // We should see these todos whose age is 27
    expect(names).toContain('Stokes Clayton');
    expect(names).toContain('Bolton Monroe');
    expect(names).toContain('Merrill Parker');

    // We shouldn't see these todos
    expect(names).not.toContain('Connie Stewart');
    expect(names).not.toContain('Lynn Ferguson');
  });


  it('Should change the view', async () => {
    await page.changeView('list');

    expect(page.getTodoCards().count()).toEqual(0); // There should be no cards
    expect(page.getTodoListItems().count()).toBeGreaterThan(0); // There should be list items
  });



  it('Should select a role, switch the view, and check that it returned correct elements', async () => {
    await page.selectMatSelectValue('todo-role-select', 'viewer');
    await page.changeView('list');

    expect(page.getTodoListItems().count()).toBeGreaterThan(0);

    // All of the todo list items should have the role we are looking for
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-role')).getText()).toEqual('viewer');
    });


  });



  it('Should click view profile on a todo and go to the right URL', async () => {
    const firstTodoOwner = await page.getTodoCards().first().element(by.className('todo-card-name')).getText();
    const firstTodoCategory = await page.getTodoCards().first().element(by.className('todo-card-category')).getText();
    await page.clickViewProfile(page.getTodoCards().first());

    // Wait until the URL contains 'todos/' (note the ending slash)
    await browser.wait(EC.urlContains('todos/'), 10000);

    // When the view profile button on the first todo card is clicked, the URL should have a valid mongo ID
    const url = await page.getUrl();
    expect(RegExp('.*\/todos\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);

    // On this profile page we were sent to, the name and category should be correct
    expect(element(by.className('todo-card-name')).getText()).toEqual(firstTodoOwner);
    expect(element(by.className('todo-card-category')).getText()).toEqual(firstTodoCategory);
  });



  it('Should click add todo and go to the right URL', async () => {
    await page.clickAddTodoFAB();

    // Wait until the URL contains 'todos/new'
    await browser.wait(EC.urlContains('todos/new'), 10000);

    // When the view profile button on the first todo card is clicked, we should be sent to the right URL
    const url = await page.getUrl();
    expect(url.endsWith('/todos/new')).toBe(true);

    // On this profile page we were sent to, We should see the right title
    expect(element(by.className('add-todo-title')).getText()).toEqual('New todo');
  });

});
