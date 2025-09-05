import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/user.service';
import { buildFullName, splitFullName } from '../../core/user.helper';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;       // submit/loading
  preloading = false;    // initial fetch when editing
  error: string | null = null;

  isEditMode = false;
  userId: number | null = null;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!idParam;
    this.userId = idParam ? Number(idParam) : null;

    if (this.isEditMode && this.userId) {
      this.preloading = true;
      this.usersService.getUser(this.userId).subscribe({
        next: (u) => {
          const { firstName, lastName } = splitFullName(u.name);
          this.form.setValue({
            firstName,
            lastName,
            email: u.email ?? ''
          });
          this.preloading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load user';
          this.preloading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;

    const { firstName, lastName, email } = this.form.getRawValue();
    const payload = {
      name: buildFullName(firstName, lastName),
      email
    };

    if (this.isEditMode && this.userId) {
      this.usersService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/users', this.userId]);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.error = 'Didn\'t work. Sorry!';
        }
      });
    } else {
      this.usersService.createUser(payload).subscribe({
        next: (created) => {
          this.loading = false;
          const id = created?.id ?? null;
          this.router.navigate(id ? ['/users', id] : ['/users']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.error = 'Didn\'t work. Sorry!';
        }
      });
    }
  }

  get firstName() { return this.form.controls.firstName; }
  get lastName() { return this.form.controls.lastName; }
  get email() { return this.form.controls.email; }

}
