import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd, IsActiveMatchOptions } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showBackButton = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.updateBackButton();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateBackButton());
  }

  private updateBackButton() {
    const matchOptions: IsActiveMatchOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    const onUsersList = this.router.isActive('/users', matchOptions);
    this.showBackButton = !onUsersList;
  }

}
