import { Component } from "@angular/core";
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, take, delay, withLatestFrom, finalize, tap } from 'rxjs/operators';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";

  public delayedProgress$ = this.loader.progress$.pipe(
    delay(100),
    withLatestFrom(this.loader.progress$),
    map(v => v[1])
  );

  constructor(public loader: LoadingBarService) {}
}
