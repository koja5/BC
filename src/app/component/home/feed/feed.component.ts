import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public id: any;
  public data: any;

  constructor(private service: FeedService) { }

  ngOnInit() {
    this.id = localStorage.getItem('id');
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe(
      data => {
        console.log(data);
        if(data !== null) {
          this.data = data[0];
        }
      }
    );
  }

}
