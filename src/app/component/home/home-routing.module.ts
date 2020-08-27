import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { ProfileComponent } from "./profile/profile.component";
import { FeedComponent } from "./feed/feed.component";
import { MessageComponent } from "./message/message.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { MyProfileComponent } from "./profile/my-profile/my-profile.component";
import { PremiumComponent } from "./premium/premium.component";
import { ConnectionComponent } from "./connection/connection.component";
import { ContactComponent } from "./contact/contact.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { EventsComponent } from "./events/events.component";
import { LifeEventDetailsComponent } from './events/life-event/life-event-details/life-event-details.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "main",
    component: HomeComponent,
    children: [
      { path: "", redirectTo: "feed", pathMatch: "full" },
      {
        path: "feed",
        component: FeedComponent,
      },
      {
        path: "my-profile",
        component: MyProfileComponent,
      },
      {
        path: "edit-profile",
        component: EditProfileComponent,
      },
      {
        path: "message",
        component: MessageComponent,
      },
      {
        path: "profile/:id",
        component: ProfileComponent,
      },
      {
        path: "premium",
        component: PremiumComponent,
      },
      {
        path: "connection",
        component: ConnectionComponent,
      },
      {
        path: "contact",
        component: ContactComponent,
      },
      {
        path: "about-us",
        component: AboutUsComponent,
      },
      {
        path: "event",
        children: [
          { path: "", redirectTo: "all", pathMatch: "full" },
          { path: "all", component: EventsComponent },
          { path: "life-event-details/:id", component: LifeEventDetailsComponent },
          { path: "edit-event/:type/:id", component: EditEventComponent }
        ],
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
