import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  public language: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  backToHome() {
    this.router.navigate(['/login']);
  }

}
