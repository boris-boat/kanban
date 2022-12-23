import { KanbanService } from './../../services/kanban.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  show = {
    signUp: false,
    signIn: true
  }
  isLoading = false
  form: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })
  constructor(private service: KanbanService, private notifierService: NotifierService, private route: Router) { }

  ngOnInit(): void {

  }
  login() {
    this.isLoading = true
    this.service.login(this.form.value).subscribe((res: any) => {

      if (res.token) {
        this.service.setActiveUser(new User(res))
      }
      else {
        this.notifierService.notify('error', 'Wrong login credentials');
        setTimeout(() => {
          this.form.reset()
          this.isLoading = false
        }, 500);
      }
    }
    )
  }
  signUp() {
    this.service.createUser(this.form.value).subscribe((res: any) => {
      if (res.text) {
        console.log(res)
        this.notifierService.notify('error', res.text);
        this.form.reset()
      }
      else {
        console.log(res)

        this.notifierService.notify('success', 'User created');
        this.form.reset()
        this.switchForms()
        this.service.setActiveUser(res)
        this.route.navigateByUrl("/home")
      }

    })



  }
  switchForms() {

    this.show.signUp = !this.show.signUp
    this.show.signIn = !this.show.signIn
  }
}
