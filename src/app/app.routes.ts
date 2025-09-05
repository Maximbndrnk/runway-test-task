import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users-list/users-list.component').then(m => m.UsersListComponent)
  },
  {
    path: 'users/new',
    loadComponent: () =>
      import('./users/user-edit/user-edit.component').then(m => m.UserEditComponent)
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./users/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },
  {
    path: 'users/:id/edit',
    loadComponent: () =>
      import('./users/user-edit/user-edit.component').then(m => m.UserEditComponent)
  },
  { path: '**', redirectTo: 'users' }
];
