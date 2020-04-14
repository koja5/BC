import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { MessageComponent } from './message/message.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { PremiumComponent } from './premium/premium.component';
import { ConnectionComponent } from './connection/connection.component';
import { PrivacyPolicyComponent } from '../templates/privacy-policy/privacy-policy.component';
import { TermsComponent } from '../templates/terms/terms.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        component: FeedComponent
      },
      {
        path: 'my-profile',
        component: MyProfileComponent
      },
      {
          path: 'edit-profile',
          component: EditProfileComponent
      },
      {
          path: 'message',
          component: MessageComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'premium',
        component: PremiumComponent
      },
      {
        path: 'connection',
        component: ConnectionComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouting {}
