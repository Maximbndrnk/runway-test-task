import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/user.service';
import { User } from '../../core/user.model';
import { AsyncPipe } from '@angular/common';
import { Observable, of, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  users$!: Observable<User[]>;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = null;

    this.users$ = this.usersService.getUsers().pipe(
      tap(() => (this.loading = false)),
      catchError((err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Something went wrong.';
        return of([] as User[]);
      })
    );
  }

  trackById(index: number, u: User) {
    return u.id ?? u.email ?? index;
  }
}
