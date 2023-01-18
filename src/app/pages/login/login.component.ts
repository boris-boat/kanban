
import { KanbanService } from './../../services/kanban.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/models/user.model';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  show = {
    signUp: false,
    signIn: true,
    googleSignIn: false
  }

  isLoading = false
  form: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })
  constructor(private service: KanbanService, private notifierService: NotifierService, private route: Router) { }

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {

      // @ts-ignore
      google.accounts.id.initialize({

        client_id: "57466034113-oflg64kqeia1k2ua99fgs35g2tcbn034.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false
      });

      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {

      })

    }
  }
  handleCredentialResponse = (response: CredentialResponse) => {
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    this.service.googleAuth(JSON.parse(jsonPayload)).subscribe((res: User) => {
      this.service.setActiveUser(res)
    })
  }
  login() {
    this.isLoading = true
    if (this.form.value) {
      this.service.login(this.form.value).subscribe((res: any) => {
        if (res.token) {
          this.service.setActiveUser(new User(res))
          // @ts-ignore
          google.accounts.id.cancel()
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
