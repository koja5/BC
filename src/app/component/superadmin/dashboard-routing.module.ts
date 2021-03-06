import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TranslationComponent } from './translation/translation.component';
import { MembersComponent } from './members/members.component';
import { EditTranslationComponent } from './translation/edit/edit-translation.component';
import { EventComponent } from './parameters/event/event.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'translation', pathMatch: 'full' },
      {
        path: 'translation',
        component: TranslationComponent
      },
      {
        path: 'members',
        component: MembersComponent
      },
      { path: 'translation/edit/:id', component: EditTranslationComponent },
      {
        path: 'event',
        component: EventComponent
      },
      {
        path: 'todo',
        component: TodoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRouting {}
