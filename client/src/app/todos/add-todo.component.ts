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
      {type: 'pattern', message: 'Owner must contain only and letters'}
    ],

    status: [
      {type: 'required', message: 'Status is required'},
      {type: 'minlength', message: 'Status must be at least 2 characters long'},
      {type: 'maxlength', message: 'Status cannot be more than 50 characters long'},

    ],


    category: [
      {type: 'pattern', message: 'category must be formatted properly'},
      {type: 'minlength', message: 'Category must be at least 2 characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 50 characters long'},
      {type: 'required', message: 'category is required'}
    ],

    body: [
      {type: 'pattern', message: 'Body must be formatted properly'},
      {type: 'minlength', message:'Body must be at least 2 characters long'},
      {type: 'maxlength', message:'Body cannot be more than 50 characters long'},
      {type: 'required', message: 'Body is required'}
    ],

    // Can add category here  if we need to
  };
// Do not want to mess around with testing yet
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
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z]+'),
      ])),

      // Since this is for a category, we need workers to be old enough to work, and probably not older than 200.
      status: new FormControl('', Validators.compose([
        Validators.required,
      ])),

      // We don't care much about what is in the category field, so we just add it here as part of the form
      // without any particular validation.
      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z]+'),
      ])),
      // We don't need a special validator just for our todo app here, but there is a default one for email.
      // We will require the email, though.
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z]+'),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('New todoID: ' + newID, null, {
        duration: 3500,
      });
    }, err => {
      this.snackBar.open('Failed to add the todo', null, {
        duration: 3500,
      });
    });
  }

}
