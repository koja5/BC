import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  public gridConfiguration: any;
  public data: any;

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.service.getGridConfiguration('members').subscribe(data => {
      this.gridConfiguration = data;
    });

    this.service.getAllUsers().subscribe(
      data => {
        console.log(data);
        this.data = data;
      }
    );
  }

}
