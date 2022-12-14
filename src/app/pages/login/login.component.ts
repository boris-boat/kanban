import { KanbanService } from './../../services/kanban.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

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
    username: new FormControl(""),
    password: new FormControl("")
  })
  constructor(private service: KanbanService, private notifierService: NotifierService) { }

  ngOnInit(): void {

  }
  login() {

    this.isLoading = true
    this.service.login(this.form.value).subscribe((res) => {
      if (!res) {
        this.notifierService.notify('error', 'Wrong login credentials');
        setTimeout(() => {
          this.form.reset()
          this.isLoading = false
          this.notifierService.hideAll()
        }, 1500);
      }
      this.service.setActiveUser(res)
    }
    )
  }
  signUp() {
    this.notifierService.notify('success', 'User created');
    this.switchForms()


  }
  switchForms() {
    this.show.signUp = !this.show.signUp
    this.show.signIn = !this.show.signIn
  }
}
