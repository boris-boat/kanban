import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../models/user.model';
import { CREATE_USER_URL, LOGIN_URL, SAVE_USER_URL } from '../constants/url.constants';
@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  activeUser: User | null = null
  constructor(private http: HttpClient, private router: Router) { }
  getUser() {
    return of(this.activeUser)
  }
  saveUser(user: User) {
    return this.http.post(SAVE_USER_URL, user)
  }
  login(data: any) {
    return this.http.post(LOGIN_URL, data)
  }
  setActiveUser(user: User) {
    if (user) {
      this.activeUser = new User(user)
      this.router.navigate(['/home'])
    }
    else {
      this.router.navigate(['/'])

    }
  }
  createUser(user: User) {
    return this.http.post(CREATE_USER_URL, user)

  }
}
