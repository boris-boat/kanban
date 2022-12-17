import { NotifierService } from 'angular-notifier';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KanbanService } from './../../services/kanban.service';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Column, Item, User } from 'src/app/models/user.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User | null = new User()
  show = {
    addItems: false,
    editItems: false
  }
  newColumn: FormControl = new FormControl("", Validators.required)
  newItem: FormControl = new FormControl("", Validators.required)

  constructor(private service: KanbanService, private router: Router, private notifierService: NotifierService) { }
  ngOnInit(): void {
    this.getUser()
  }
  getUser() {
    this.service.getUser().subscribe((res: any) => {
      if (!res) this.router.navigate(['/'])
      this.user = res
    })
  }
  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.service.saveUser(new User(this.user)).subscribe((res) => console.log(res))
  }
  logout() {
    this.user = null
    this.router.navigate(['/'])
  }
  addItemsShow() {
    this.show.addItems = !this.show.addItems
  }
  addColumn() {
    if (this.user) {

      let res = this.user.columns.find((column: Column) => column.name === this.newColumn.value)
      console.log(res)
      //ovde daje undefined
      if (!res) {
        this.user.columns.push(new Column({ name: this.newColumn.value, items: [] }))
        this.newColumn.reset()
        this.service.saveUser(this.user).subscribe((res) => {
          console.log(res)
        })
      }
      else {
        this.notifierService.notify('error', 'Please select unique name for your column');

      }
    }

  }
  addItem() {
    if (this.user) {

      this.user.columns[0].items.push({ text: this.newItem.value })
      this.newItem.reset()
      this.service.saveUser(this.user).subscribe((res: any) => { this.user = res })
    }
  }
  removeColumn(data: any) {
    if (this.user) {
      this.user.columns = this.user.columns.filter((item: Column) => item.name !== data.name)
      this.service.saveUser(this.user).subscribe((res: any) => { this.user = res })
    }
  }
  removeItem(itemToDelete: any, columnToEdit: any) {
    if (this.user) {

      columnToEdit.items = columnToEdit.items.filter((item: Item) => item._id != itemToDelete._id)

      let index = this.user.columns.findIndex((column: Column) => column.name === columnToEdit.name)
      this.user.columns[index] = columnToEdit
      this.service.saveUser(this.user).subscribe((res: any) => {
        this.user = res
      })
    }
  }
}
