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


  constructor(private service: KanbanService, private router: Router) { }

  ngOnInit(): void {
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
}
