import { Component, OnInit } from '@angular/core';
import { DynamicService } from 'src/app/services/dynamic.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  public path = 'grid';
  public name = 'todo';

  constructor(private service: DynamicService) { }

  ngOnInit() {
  }

}
