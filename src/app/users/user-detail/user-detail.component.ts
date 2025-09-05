import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/user.service';
import { User } from '../../core/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  user: User | null = null;
  id!: number;

  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsed = Number(idParam);
    if (!idParam || Number.isNaN(parsed) || parsed <= 0) {
      this.router.navigate(['/users']);
      return;
    }
    this.id = parsed;
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;
    this.usersService.getUser(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => {
          this.user = u;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.error = 'Failed to load user';
        }
      });
  }

  delete(): void {
    if (!confirm('Delete user?')) return;
    this.usersService.deleteUser(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          console.error(err);
          this.error = 'Failed to delete user';
        }
      });
  }
}
