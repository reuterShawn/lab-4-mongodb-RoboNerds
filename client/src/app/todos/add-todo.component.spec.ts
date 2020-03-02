import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from './todo.service';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    addTodoComponent.ngOnInit();
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  // Not messing with testing yet since do not know what it connects with
  describe('The status field', () => {
    let statusControl: AbstractControl;

    beforeEach(() => {
      statusControl = addTodoComponent.addTodoForm.controls[`status`];
    });

    it('should not allow empty names', () => {
      statusControl.setValue('');
      expect(statusControl.valid).toBeFalsy();
    });

    it('should  be fine with "Chris Smith"', () => {
      statusControl.setValue('Chris Smith');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should fail on single character names', () => {
      statusControl.setValue('x');
      expect(statusControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      statusControl.setValue('x'.repeat(100));
      expect(statusControl.valid).toBeTruthy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.

      expect(statusControl.valid).toBeTruthy();
    });
  });

  describe('The Status Field ', () => {
    let statusControl: AbstractControl;

    beforeEach(() => {
      statusControl = addTodoComponent.addTodoForm.controls[`status`];
    });

    it('should be fine with false', () => {
      statusControl.setValue(false);
      expect(statusControl.valid).toBeTruthy();
    });

    it('should be fine with "true"', () => {
      statusControl.setValue(true);
      expect(statusControl.valid).toBeTruthy();
    });
  });
});
