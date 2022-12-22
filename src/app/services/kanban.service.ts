import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  url: string = "https://podsetnik.herokuapp.com/kanban"
  activeUser: User | null = null
  constructor(private http: HttpClient, private router: Router) { }
  getUser() {
    return of(this.activeUser)
  }
  saveUser(user: User) {
    return this.http.post(this.url + "/updateUser", user)


  }
  login(data: any) {
    return this.http.post(this.url + "/getUser", data)
  }
  setActiveUser(user: any) {
    if (user) {
      this.activeUser = new User(user)
      this.router.navigate(['/home'])
    }
    else {
      this.router.navigate(['/'])

    }
  }
  createUser(user: any) {
    return this.http.post(this.url + "/createUser", user)

  }
}
