import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  public gridConfiguration: any;
  public data: any;
  public height: any;

  constructor(private service: DashboardService) { }

  ngOnInit() {
    this.height = window.innerHeight - 81;
    this.height += "px";
    this.initialization();
  }

  initialization() {
    this.service.getGridConfiguration('members').subscribe(data => {
      this.gridConfiguration = data;
    });

    this.service.getAllUsers().subscribe(
      data => {
        this.data = data;
      }
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.height = window.innerHeight - 81;
    this.height += "px";
  }

}
