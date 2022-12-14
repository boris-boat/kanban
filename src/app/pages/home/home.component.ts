import { NotifierService } from 'angular-notifier';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KanbanService } from './../../services/kanban.service';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any
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
  drop(event: CdkDragDrop<string[]>) {
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
    this.service.saveUser(this.user).subscribe((res) => console.log(res))
  }
  logout() {
    this.user = null
    this.router.navigate(['/'])
  }
  addItemsShow() {
    this.show.addItems = !this.show.addItems
  }
  addColumn() {
    let res = this.user.columns.find((column: any) => column.name === this.newColumn.value)
    console.log(res)
    if (!res) {

      this.user.columns.push({ name: this.newColumn.value, items: [] })
      this.newColumn.reset()
      this.service.saveUser(this.user).subscribe((res) => {
        console.log(res)
      })
    }
    else {
      this.notifierService.notify('error', 'Please select unique name for your column');

    }

  }
  addItem() {
    this.user.columns[0].items.push({ text: this.newItem.value })
    this.newItem.reset()
    this.service.saveUser(this.user).subscribe((res) => { this.user = res })
  }
  removeColumn(data: any) {
    this.user.columns = this.user.columns.filter((item: any) => item.name !== data.name)
    this.service.saveUser(this.user).subscribe((res) => { this.user = res })
  }
  removeItem(itemToDelete: any, columnToEdit: any) {
    columnToEdit.items = columnToEdit.items.filter((item: any) => item._id != itemToDelete._id)
    console.log(
      this.user.columns
    )
    let index = this.user.columns.findIndex((column: any) => column.name === columnToEdit.name)
    this.user.columns[index] = columnToEdit
    this.service.saveUser(this.user).subscribe((res) => { this.user = res })
  }
}
