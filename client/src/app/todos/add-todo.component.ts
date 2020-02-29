import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  constructor(private fb: FormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Owner must contain only letters'},
      {type: 'existingOwner', message: 'Owner has already been taken'}
    ],

    status: [
      {type: 'pattern', message: 'Age must be a boolean'},
      {type: 'min', message: 'Status must be true or false'},
      {type: 'required', message: 'Status is required'}
    ],

    body: [
      {type: 'body', message: 'Body must be formatted properly'},
      {type: 'required', message: 'Body is required'}
    ],

    // Can add category here  if we need to
  };

// Fix these later not sure exactly how to format these yet
  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingOwner: true});
          } else {
            return null;
          }
        },
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      age: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+[0-9]?'),
        Validators.min(15),
        Validators.max(200),
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      company: new FormControl(),

      // We don't need a special validator just for our todo app here, but there is a default one for email.
      // We will require the email, though.
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),

      role: new FormControl('viewer', Validators.compose([
        Validators.required,
        Validators.pattern('^(admin|editor|viewer)$'),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('Added Todo ' + this.addTodoForm.value.owner, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the todo', null, {
        duration: 2000,
      });
    });
  }

}
