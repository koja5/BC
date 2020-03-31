import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {
  public gridConfiguration: any;
  public data: any;

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.service.getGridConfiguration('translation').subscribe(data => {
      this.gridConfiguration = data;
    });

    this.service.getTranslation().subscribe(
      data => {
        console.log(data);
        this.data = data;
      }
    );
  }
}
