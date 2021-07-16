import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;

  language: any;

  constructor(private helpService: HelpService,
    private router: Router) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

  public navigateToCreateLifeEventPage(): void {
    this.modal.close();
    this.router.navigate(['/home/main/event/edit-event/life/create']);

  }

  public navigateToCreateVirtualEventPage(): void {
    this.modal.close();
    this.router.navigate(['/home/main/event/edit-event/virtual/create']);
  }
}
